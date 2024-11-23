const PedersenCommitment = artifacts.require("PedersenCommitment");

module.exports = function (deployer) {
  deployer.deploy(PedersenCommitment);
};
