const expectedExceptionPromise = require("../utils/expectedException.js");
web3.eth.getTransactionReceiptMined = require("../utils/getTransactionReceiptMined.js");
Promise = require("bluebird");
Promise.allNamed = require("../utils/sequentialPromiseNamed.js");
const randomIntIn = require("../utils/randomIntIn.js");
const toBytes32 = require("../utils/toBytes32.js");

if (typeof web3.eth.getAccountsPromise === "undefined") {
    Promise.promisifyAll(web3.eth, { suffix: "Promise" });
}

const Regulator = artifacts.require("./Regulator.sol");
const TollBoothOperator = artifacts.require("./TollBoothOperator.sol");

contract('TollBoothOperator', function(accounts) {

    let owner0, owner1,
        booth0, booth1, booth2,
        vehicle0, vehicle1,
        regulator, operator;
    const price01 = randomIntIn(1, 1000);
    const deposit0 = price01 + randomIntIn(1, 1000);
    const deposit1 = deposit0 + randomIntIn(1, 1000);
    const vehicleType0 = randomIntIn(1, 1000);
    const vehicleType1 = vehicleType0 + randomIntIn(1, 1000);
    const multiplier0 = randomIntIn(1, 1000);
    const multiplier1 = multiplier0 + randomIntIn(1, 1000);
    const tmpSecret = randomIntIn(1, 1000);
    const secret0 = toBytes32(tmpSecret);
    const secret1 = toBytes32(tmpSecret + randomIntIn(1, 1000));
    let hashed0, hashed1;

    before("should prepare", function() {
        assert.isAtLeast(accounts.length, 8);
        owner0 = accounts[0];
        owner1 = accounts[1];
        booth0 = accounts[2];
        booth1 = accounts[3];
        booth2 = accounts[4];
        vehicle0 = accounts[5];
        vehicle1 = accounts[6];
        return web3.eth.getBalancePromise(owner0)
            .then(balance => assert.isAtLeast(web3.fromWei(balance).toNumber(), 10));
    });

    describe("Vehicle Operations", function() {

        beforeEach("should deploy regulator and operator", function() {
            return Regulator.new({ from: owner0 })
                .then(instance => regulator = instance)
                .then(() => regulator.setVehicleType(vehicle0, vehicleType0, { from: owner0 }))
                .then(tx => regulator.setVehicleType(vehicle1, vehicleType1, { from: owner0 }))
                .then(tx => regulator.createNewOperator(owner1, deposit0, { from: owner0 }))
                .then(tx => operator = TollBoothOperator.at(tx.logs[1].args.newOperator))
                .then(() => operator.addTollBooth(booth0, { from: owner1 }))
                .then(tx => operator.addTollBooth(booth1, { from: owner1 }))
                .then(tx => operator.addTollBooth(booth2, { from: owner1 }))
                .then(tx => operator.setMultiplier(vehicleType0, multiplier0, { from: owner1 }))
                .then(tx => operator.setMultiplier(vehicleType1, multiplier1, { from: owner1 }))
                .then(tx => operator.setRoutePrice(booth0, booth1, price01, { from: owner1 }))
                .then(tx => operator.setPaused(false, { from: owner1 }))
                .then(tx => operator.hashSecret(secret0))
                .then(hash => hashed0 = hash)
                .then(tx => operator.hashSecret(secret1))
                .then(hash => hashed1 = hash);
        });

        // vehicle1 enters at booth1 and deposits required amount (say 10).
        // vehicle1 exits at booth2, which route price happens to equal the deposit amount (so 10).
        // vehicle1 gets no refund.
        it("should do Scenario 1", () => {
            const requiredPrice = deposit0 * multiplier0; 

            return operator.setRoutePrice(booth0, booth1, deposit0, { from: owner1})
                .then(() => {
                    return operator.enterRoad(booth0, hashed0, { from: vehicle0, value: requiredPrice });
                })
                .then(() => operator.reportExitRoad(secret0, { from: booth1 }))
                .then(tx => {

                    assert.strictEqual(tx.logs.length, 1, "#2");
                    const logExited = tx.logs[0];
                    assert.strictEqual(logExited.event, "LogRoadExited", "#3");
                    assert.strictEqual(logExited.args.exitBooth, booth1, "#4");
                    assert.strictEqual(logExited.args.exitSecretHashed, hashed0, "#5");
                    assert.strictEqual(logExited.args.finalFee.toNumber(), requiredPrice, "#6");
                    assert.strictEqual(logExited.args.refundWeis.toNumber(), 0, "#7");
                });

        });

        // vehicle1 enters at booth1 and deposits required amount (say 10).
        // vehicle1 exits at booth2, which route price happens to be more than the deposit amount (say 15).
        // vehicle1 gets no refund.
        it("should do Scenario 2", () => {
            
            const baseRoutePrice = deposit0 + 10;
            const requiredPrice = baseRoutePrice * multiplier0;  
            const depositLeft = requiredPrice - 15;

            return operator.setRoutePrice(booth0, booth1, baseRoutePrice, { from: owner1 })
                .then(() => {
                    return operator.enterRoad(booth0, hashed0, { from: vehicle0, value: depositLeft });
                })
                .then(() => operator.reportExitRoad(secret0, { from: booth1 }))
                .then(tx => {

                    assert.strictEqual(tx.logs.length, 1, "#2");
                    const logExited = tx.logs[0];
                    assert.strictEqual(logExited.event, "LogRoadExited", "#3");
                    assert.strictEqual(logExited.args.exitBooth, booth1, "#4");
                    assert.strictEqual(logExited.args.exitSecretHashed, hashed0, "#5");
                    assert.strictEqual(logExited.args.finalFee.toNumber(), depositLeft, "#6");
                    assert.strictEqual(logExited.args.refundWeis.toNumber(), 0, "#7");
                });

        });

        // * `vehicle1` enters at `booth1` and deposits required amount (say 10).
        // * `vehicle1` exits at `booth2`, which route price happens to be less than the deposit amount (say 6).
        // * `vehicle1` gets refunded the difference (so 4).
        it("should do Scenario 3", () => {
            
            const deposited = deposit0 * multiplier0; 
            const finalFee = price01 * multiplier0;
            const refund = deposited - finalFee;

            console.log("enterRoad");
            return operator.enterRoad(booth0, hashed0, { from: vehicle0, value: deposited })
                .then(() => {
                    console.log("reportExitRoad");
                    return operator.reportExitRoad(secret0, { from: booth1 });
                })
                .then(tx => {
                    assert.strictEqual(tx.logs.length, 1, "#2");
                    const logExited = tx.logs[0];
                    assert.strictEqual(logExited.event, "LogRoadExited", "#3");
                    assert.strictEqual(logExited.args.exitBooth, booth1, "#4");
                    assert.strictEqual(logExited.args.exitSecretHashed, hashed0, "#5");
                    assert.strictEqual(logExited.args.finalFee.toNumber(), finalFee, "#6");
                    assert.strictEqual(logExited.args.refundWeis.toNumber(), refund, "#7");
                });
        });

        // vehicle1 enters at booth1 and deposits (say 14) more than the required amount (say 10).
        // vehicle1 exits at booth2, which route price happens to equal the deposit amount (so 10).
        // vehicle1 gets refunded the difference (so 4).
        it("should do Scenario 4", () => {

            const baseRoutePrice = deposit0 - 42;
            const requiredDeposit = deposit0 * multiplier0; 
            const extra = 4; 
            const depositLeft = requiredDeposit + extra;
            const finalFee = baseRoutePrice * multiplier0;

            return operator.setRoutePrice(booth0, booth1, baseRoutePrice, { from: owner1 })
                .then(() => operator.enterRoad(booth0, hashed0, { from: vehicle0, value: depositLeft }))
                .then(() => operator.reportExitRoad(secret0, { from: booth1 }))
                .then(tx => {

                    assert.strictEqual(tx.logs.length, 1, "#2");
                    const logExited = tx.logs[0];
                    assert.strictEqual(logExited.event, "LogRoadExited", "#3");
                    assert.strictEqual(logExited.args.exitBooth, booth1, "#4");
                    assert.strictEqual(logExited.args.exitSecretHashed, hashed0, "#5");
                    assert.strictEqual(logExited.args.finalFee.toNumber(), finalFee, "#6");
                    assert.strictEqual(logExited.args.refundWeis.toNumber(), depositLeft - finalFee, "#7");

                });

        });

       //       * Scenario 5:
       // * `vehicle1` enters at `booth1` and deposits (say 14) more than the required amount (say 10).
       // * `vehicle1` exits at `booth2`, which route price happens to be unknown.
       // * the operator's owner updates the route price, which happens to be less than the deposited amount (say 11).
       // * `vehicle1` gets refunded the difference (so 3).
       it("should do Scenario 5", () => {
            
            const deposited = ( deposit0 + 15 ) * multiplier0; 
            const newPrice = deposit0 - 42;
            const refund = deposited - newPrice * multiplier0;
            const finalFee = newPrice * multiplier0;

            console.log("enterRoad");
            return operator.enterRoad(booth0, hashed0, { from: vehicle0, value: deposited })
                .then(() => {
                   console.log("setRoutePrice");
                   return operator.setRoutePrice(booth0, booth1, 0, { from: owner1 });
                })
                .then(() => {
                    console.log("reportExitRoad");
                    return operator.reportExitRoad(secret0, { from: booth1 });
                    const logPendingPayment = tx.logs[0];
                    assert.strictEqual(logPendingPayment.event, "LogPendingPayment", "#3");
                })
                .then(() => {
                   console.log("setRoutePrice");
                   return operator.setRoutePrice(booth0, booth1, newPrice, { from: owner1 });
                })
                .then(tx => {
                    assert.strictEqual(tx.logs.length, 2, "#2");
                    const logPriceSet = tx.logs[0];
                    assert.strictEqual(logPriceSet.event, "LogRoutePriceSet", "#3");
                    const logExited = tx.logs[1];
                    assert.strictEqual(logExited.event, "LogRoadExited", "#3");
                    assert.strictEqual(logExited.args.exitBooth, booth1, "#4");
                    assert.strictEqual(logExited.args.exitSecretHashed, hashed0, "#5");
                    assert.strictEqual(logExited.args.finalFee.toNumber(), finalFee, "#6");
                    assert.strictEqual(logExited.args.refundWeis.toNumber(), refund, "#7");
                });
        });

        // vehicle1 enters at booth1 and deposits more (say 14) than the required amount (say 10).
        // vehicle1 exits at booth2, which route price happens to be unknown.
        // vehicle2 enters at booth1 and deposits the exact required amount (so 10).
        // vehicle2 exits at booth2, which route price happens to be unknown.
        // the operator's owner updates the route price, which happens to be less than the required deposit (so 6).
        // vehicle1 gets refunded the difference (so 8).
        // someone (anyone) calls to clear one pending payment.
        // vehicle2 gets refunded the difference (so 4).
        it("should do Scenario 6", () => {
            
            const depositedV0 = ( deposit0 + 15 ) * multiplier0;
            const depositedV1 = deposit0 * multiplier1; 
            const newPrice = deposit0 - 42;
            const finalFeeV0 = newPrice * multiplier0;
            const finalFeeV1 = newPrice * multiplier1;
            const refundV0 = depositedV0 - finalFeeV0;
            const refundV1 = depositedV1 - finalFeeV1;


            console.log("setRoutePrice"); 
            return operator.setRoutePrice(booth0, booth1, 0, { from: owner1 })
                .then(() => operator.enterRoad(booth0, hashed0, { from: vehicle0, value: depositedV0 }))
                .then(() => operator.reportExitRoad(secret0, { from: booth1 }))
                .then(() => operator.enterRoad(booth0, hashed1, { from: vehicle1, value: depositedV1 }))
                .then(() => operator.reportExitRoad(secret1, { from: booth1 }))
                .then(() => operator.setRoutePrice(booth0, booth1, newPrice, { from: owner1 }))
                .then(tx => {
                    assert.strictEqual(tx.logs.length, 2, "#2");
                    const logPriceSet = tx.logs[0];
                    assert.strictEqual(logPriceSet.event, "LogRoutePriceSet", "#3");
                    const logExited = tx.logs[1];
                    assert.strictEqual(logExited.event, "LogRoadExited", "#3");
                    assert.strictEqual(logExited.args.exitBooth, booth1, "#4");
                    assert.strictEqual(logExited.args.exitSecretHashed, hashed0, "#5");
                    assert.strictEqual(logExited.args.finalFee.toNumber(), finalFeeV0, "#6");
                    assert.strictEqual(logExited.args.refundWeis.toNumber(), refundV0, "#7");
                })
                .then(() => operator.clearSomePendingPayments(booth0, booth1, 1, { from: vehicle1 }))
                .then(tx => {
                    assert.strictEqual(tx.logs.length, 1, "#2");
                    const logExited = tx.logs[0];
                    assert.strictEqual(logExited.event, "LogRoadExited", "#3");
                    assert.strictEqual(logExited.args.exitBooth, booth1, "#4");
                    assert.strictEqual(logExited.args.exitSecretHashed, hashed1, "#5");
                    assert.strictEqual(logExited.args.finalFee.toNumber(), finalFeeV1, "#6");
                    assert.strictEqual(logExited.args.refundWeis.toNumber(), refundV1, "#7");
                });
        });
    });




});
