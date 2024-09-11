const ElliptiCurveOperations = artifacts.require("EllipticCurveOperations");

module.exports = function (deployer) {
  deployer.deploy(ElliptiCurveOperations);
};
