const express = require("express");
// const Web3 = require("web3");
const { Web3 } = require("web3");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to local Ethereum node (Ganache)
const web3 = new Web3("http://127.0.0.1:7475");

// ABI and contract address (replace with your deployed contract details)
const contractABI = [
  /* your contract ABI here */
];
const contractAddress = "0x75156c96067093dFF553394544830D496e9930F5";

const zkBlockMature = new web3.eth.Contract(contractABI, contractAddress);

// Endpoint to add commitment
app.post("/addCommitment", async (req, res) => {
  const { address, commitment, proof } = req.body;
  try {
    await zkBlockMature.methods
      .addCommitment(commitment, proof)
      .send({ from: address });
    res.send("Commitment added!");
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Endpoint to verify age
app.post("/verifyAge", async (req, res) => {
  const { address, commitment, proof } = req.body;
  try {
    const isEligible = await zkBlockMature.methods
      .performAgeVerification(commitment, proof)
      .send({ from: address });
    res.send(isEligible ? "Age verified!" : "Age verification failed.");
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
