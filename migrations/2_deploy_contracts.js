var Regulator = artifacts.require("./Regulator.sol");
var TollBoothOperator = artifacts.require("./TollBoothOperator.sol");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(Regulator, {from: accounts[0]})
        .then(() => Regulator.deployed())
        .then(regulatorInstance => regulatorInstance.createNewOperator(accounts[1], 42, {from: accounts[0], gas: 3600000}))
        .then(tx => TollBoothOperator.at(tx.logs[1].args.newOperator))
        .then(tollBoothOperatorInstance => tollBoothOperatorInstance.setPaused(false, {from: accounts[1]}));
};
