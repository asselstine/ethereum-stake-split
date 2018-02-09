var Polystake = artifacts.require("./Polystake.sol");

module.exports = function(deployer) {
  deployer.deploy(Polystake);
};
