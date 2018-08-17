// migrations/2_erc223.js
const ERC223 = artifacts.require("./ERC223.sol");

module.exports = function(deployer) {
  deployer.deploy(ERC223);
};
