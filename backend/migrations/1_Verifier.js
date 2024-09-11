// const Groth16Verifier = artifacts.require("Groth16Verifier");
// // const ZKBlockMature = artifacts.require("ZKBlockMature");

// module.exports = async function (deployer) {
//   await deployer.deploy(Groth16Verifier);
//   // const verifier = await Groth16Verifier.deployed();

//   // deployer.deploy(ZKBlockMature, verifier.address);
// };
// const Groth16Verifier = artifacts.require("Groth16Verifier");
const AgeVerifier = artifacts.require("Groth16Verifier");
const ZKBlockMature = artifacts.require("ZKBlockMature");

module.exports = async function (deployer) {
  await deployer.deploy(AgeVerifier);
  const verifier = await AgeVerifier.deployed();
  await deployer.deploy(ZKBlockMature, verifier.address);
};
