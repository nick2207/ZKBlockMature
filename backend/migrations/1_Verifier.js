const Verifier = artifacts.require("Groth16Verifier");
const ZKBlockMature = artifacts.require("ZKBlockMature");

module.exports = async function (deployer) {
  deployer.deploy(Verifier);
  const verifier = await Verifier.deployed();

  deployer.deploy(ZKBlockMature, verifier.address);
};
