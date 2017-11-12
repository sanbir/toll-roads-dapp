var Regulator = artifacts.require("./Regulator.sol");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(Regulator, {from: accounts[0]});
};
