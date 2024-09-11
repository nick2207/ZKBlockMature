const ElliptiCurve = artifacts.require("EllipticCurve");

module.exports = function (deployer) {
  deployer.deploy(ElliptiCurve);
};
