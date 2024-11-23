// const ZKBlockMature = artifacts.require("ZKBlockMature");
// const fs = require("fs");
// const path = require("path");

// contract("ZKBlockMature", (accounts) => {
//   let instance;

//   before(async () => {
//     instance = await ZKBlockMature.deployed();
//   });

//   it("should verify proof correctly", async () => {
//     // Load proof and public signals
//     const proofPath = path.resolve(
//       __dirname,
//       "/Users/nico/nycode/PROJECTS/ZKBlockMature/backend/proofs/proof.json"
//     );
//     const publicSignalsPath = path.resolve(
//       __dirname,
//       "/Users/nico/nycode/PROJECTS/ZKBlockMature/backend/proofs/public.json"
//     );
//     proof = JSON.parse(fs.readFileSync(proofPath, "utf8"));
//     pubSignals = JSON.parse(fs.readFileSync(publicSignalsPath, "utf8"));
//     // Call the contract's function
//     let a = proof.pi_a.slice(0, 2); // pi_a
//     let b = [proof.pi_b[0].reverse(), proof.pi_b[1].reverse()]; // pi_b
//     let c = proof.pi_c.slice(0, 2); // pi_c
//     const result = await instance.verifyProof(a, b, c, pubSignals, {
//       from: accounts[0],
//     });
//     const proofVerificationEvent = result.logs.find(
//       (log) => log.event === "ProofVerification"
//     );

//     console.log("Verification result:", proofVerificationEvent);
//     assert.equal(
//       result.logs[0].args.result,
//       false,
//       "Proof verification failed"
//     );
//   });
// });

const ZKBlockMature = artifacts.require("ZKBlockMature");
const fs = require("fs");
const path = require("path");
const { groth16, Groth16Proof, PublicSignals } = require("snarkjs");

contract("ZKBlockMature", (accounts) => {
  let instance;

  before(async () => {
    instance = await ZKBlockMature.deployed();
  });

  it("should verify proof correctly", async () => {
    // Load proof and public signals
    // const proofPath = path.resolve(__dirname, "../proofs/proof.json");
    // const publicSignalsPath = path.resolve(__dirname, "../proofs/public.json");
    const inputPath = path.resolve(__dirname, "../proofs/input.json");
    const input = JSON.parse(fs.readFileSync(inputPath, "utf8"));
    const wasmPath = path.resolve(__dirname, "../proofs/checkAge.wasm");
    const zKeyPath = path.resolve(__dirname, "../proofs/checkAge_001.zkey");

    let data = await groth16.fullProve(input, wasmPath, zKeyPath);
    proof = data.proof;
    publicSignals = data.publicSignals;

    // const proof = JSON.parse(fs.readFileSync(proofPath, "utf8"));
    // const pubSignals = JSON.parse(fs.readFileSync(publicSignalsPath, "utf8"));

    // Prepare proof components
    // let a = proof.pi_a.slice(0, 2); // pi_a
    // let b = [proof.pi_b[0].reverse(), proof.pi_b[1].reverse()]; // pi_b
    // let c = proof.pi_c.slice(0, 2); // pi_c

    // // Prepare public signals
    // let pubSignal = pubSignals.map((x) => BigInt(x)); // Convert to BigInt

    let foo = await groth16.exportSolidityCallData(proof, publicSignals);
    const argv = foo
      .replace(/["[\]\s]/g, "")
      .split(",")
      .map((x) => BigInt(x).toString());

    const a = [argv[0], argv[1]];
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]];
    const Input = [];

    for (let i = 8; i < argv.length; i++) {
      Input.push(argv[i]);
    }

    try {
      const result = await instance.submitProof(a, b, c, Input, {
        from: accounts[0],
      });
      console.log(result.logs);

      // Check if ProofVerification event was emitted
      const proofVerificationEvent = result.logs.find(
        (log) => log.event === "ProofVerification"
      );

      if (proofVerificationEvent) {
        const isSuccess = proofVerificationEvent.args.result;
        console.log("Verification result:", isSuccess);
        assert.equal(isSuccess, true, "Proof verification success");
      } else {
        assert.fail("ProofVerification event not emitted");
      }
    } catch (error) {
      assert.fail("Error during proof verification:", error);
    }
  });
});
