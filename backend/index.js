const express = require("express");
const bodyParser = require("body-parser");
const Web3 = require("web3");
const contract = require("@truffle/contract");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const ZKBlockMatureJSON = require("./build/contracts/ZKBlockMature.json");
const web3 = new Web3("http://127.0.0.1:7545"); // Connect to Ganache
const ZKBlockMature = contract(ZKBlockMatureJSON);
ZKBlockMature.setProvider(web3.currentProvider);

let zkBlockMatureInstance;

ZKBlockMature.deployed().then((instance) => {
  zkBlockMatureInstance = instance;
});

app.post("/commitAge", async (req, res) => {
  const { randomValue, age } = req.body;
  const accounts = await web3.eth.getAccounts();
  await zkBlockMatureInstance.commitAge(randomValue, age, {
    from: accounts[0],
  });
  res.send("Age commitment successful");
});

app.post("/verifyAge", async (req, res) => {
  const { randomValue, age } = req.body;
  const accounts = await web3.eth.getAccounts();
  await zkBlockMatureInstance.verifyAge(randomValue, age, {
    from: accounts[0],
  });
  res.send("Age verification process initiated");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
