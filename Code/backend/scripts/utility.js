const { Web3 } = require("web3");
const fs = require("fs");

const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7475");
// const web3 = new Web3(new Web3.HttpProvider("http://127.0.0.1:7475")); // Correct provider for v4.x

const contractABI = JSON.parse(
  fs.readFileSync("../build/contracts/PedersenCommitment.json", "utf8")
);

const contractAddress = "0xd128783beE59031187486615160e15A4C1868344";

const PedersenCommitment = new web3.eth.Contract(
  contractABI.abi,
  contractAddress
);

async function performCommitment() {
  const accounts = await web3.eth.getAccounts();

  if (!(await PedersenCommitment.methods.getPoint().call()))
    await PedersenCommitment.methods.setPoint().send({ from: accounts[0] });
  const generator = await PedersenCommitment.methods.getPoint().call();
  console.log("Generator: ", generator);

  const randomValue = 42; // Set random value for the commitment
  const value = BigInt("20240915"); // The value you want to commit

  // Call the commit function and get transaction receipt
  const receipt = await PedersenCommitment.methods
    .commit(randomValue, value)
    .send({ from: accounts[0], gas: 30000000 });

  // Log transaction receipt and extracted values
  // console.log("Transaction Receipt:", receipt);

  const event = receipt.events.LogCommitment;

  if (event) {
    const txId = event.returnValues.txId;
    const x = event.returnValues.x;
    const y = event.returnValues.y;

    console.log(`Commitment Success!`);
    console.log(`Generator: ${generator}`);
    console.log(`txId: ${txId}`);
    console.log(`x: ${x}`);
    console.log(`y: ${y}`);
  } else {
    console.log("No LogCommitment event found.");
  }
}

performCommitment().catch(console.error);
