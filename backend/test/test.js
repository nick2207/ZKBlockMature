const chai = require("chai");
const chaiHttp = require("chai-http");
const Web3 = require("web3");
const contract = require("@truffle/contract");
const ZKBlockMatureJSON = require("../build/contracts/ZKBlockMature.json");

chai.use(chaiHttp);
const { expect } = chai;
const web3 = new Web3("http://127.0.0.1:7545"); // Connect to Ganache
const ZKBlockMature = contract(ZKBlockMatureJSON);
ZKBlockMature.setProvider(web3.currentProvider);

describe("ZKBlockMature API", function () {
  let zkBlockMatureInstance;
  let accounts;

  before(async function () {
    zkBlockMatureInstance = await ZKBlockMature.deployed();
    accounts = await web3.eth.getAccounts();
  });

  describe("POST /commitAge", function () {
    it("should commit age successfully", function (done) {
      const randomValue = 123456; // Example random value
      const age = 20; // Example age

      chai
        .request("http://localhost:3000")
        .post("/commitAge")
        .send({ randomValue, age })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.equal("Age commitment successful");
          done();
        });
    });
  });

  describe("POST /verifyAge", function () {
    it("should verify age successfully", function (done) {
      const randomValue = 123456; // Example random value
      const age = 20; // Example age

      chai
        .request("http://localhost:3000")
        .post("/verifyAge")
        .send({ randomValue, age })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.equal("Age verification process initiated");
          done();
        });
    });
  });
});
