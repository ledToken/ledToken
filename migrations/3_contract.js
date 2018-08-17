// migrations/3_ContractReceiver.js
const ContractReceiver = artifacts.require("./ContractReceiver.sol");

module.exports = function(deployer) {
  deployer.deploy(ContractReceiver);
};
