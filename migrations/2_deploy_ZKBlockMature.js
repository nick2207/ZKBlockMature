const ZKBlockMature = artifacts.require("ZKBlockMature");

module.exports = function (deployer) {
  deployer.deploy(ZKBlockMature);
};
