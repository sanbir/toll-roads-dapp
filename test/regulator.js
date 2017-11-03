const expectedExceptionPromise = require("../utils/expectedException.js");
web3.eth.getTransactionReceiptMined = require("../utils/getTransactionReceiptMined.js");

const randomIntIn = require("../utils/randomIntIn.js");
const toBytes32 = require("../utils/toBytes32.js");

const Regulator = artifacts.require("./Regulator.sol");

contract("Regualtor", () => {
	let regulatorOwner, account1, regulator;
	let vehicle0, vehicle1, vehicle2;
	const addressZero = "0x0000000000000000000000000000000000000000";
	const vehicleType0 = 1;

	before("should prepare", () => {
		assert.isAtLeast(accounts.length, 5);
		regulatorOwner = accounts[0];
		account1 = accounts[1];
		vehicle0 = accounts[2];
		vehicle1 = accounts[3];
		vehicle2 = accounts[4];
	});

	beforeEach("should deploy a new Regulator", async () => {
		regulator = await Regulator.new({ from: regulatorOwner });
	});

	describe("setVehicleType", () => {

		it("should have correct entered vehicle type", async () => {
			let funcRes = await regulator.setVehicleType(vehicle0, vehicleType0, { from: regulatorOwner });
		});

	});
});

