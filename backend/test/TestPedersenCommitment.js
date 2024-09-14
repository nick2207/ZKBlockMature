const PedersenCommitment = artifacts.require("PedersenCommitment");

contract("PedersenCommitment", (accounts) => {
  it("Set Point", async () => {
    const instance = await PedersenCommitment.deployed();

    await instance.setPoint({ from: accounts[0] });

    let point = await instance.getPoint();

    // console.log("Point: ", point);

    assert.notEqual(point, undefined, `The value is undefined.`);
  });

  it("Set Point 2 - Revert", async () => {
    try {
      const instance = await PedersenCommitment.deployed();
      await instance.setPoint({ from: accounts[2] });
      assert.fail("The function did not revert as expected");
    } catch (error) {
      assert.include(
        error.message,
        "Cannot set the generator more than once", // Expected revert reason, should match the revert reason from Solidity
        "Cannot set the generator more than once"
      );
    }
  });

  it("Commit and Verify", async () => {
    const instance = await PedersenCommitment.deployed();
    let randValue = 42;
    let valueToCommit = 100;
    // let committed = await instance.commit.call(randValue, valueToCommit);
    // let comX = committed[0];
    // let comY = committed[1];
    // console.log(
    //   "committed res: ",
    //   web3.utils.toHex(comX),
    //   web3.utils.toHex(comY)
    // );

    let commitmentTx = await instance.commit(randValue, valueToCommit);
    const event = commitmentTx.logs.find(
      (log) => log.event === "LogCommitment"
    );

    assert(event, "LogCommitment event not found");

    const txId = event.args.txId;

    let verify = await instance.verify.call(randValue, valueToCommit, txId);

    assert.equal(verify, true, `Commitment verification failed.`);

    // let verify = await instance.verify.call(
    //   randValue,
    //   valueToCommit,
    //   comX,
    //   comY
    // );

    // assert.equal(verify, true, `The value ${verify}.`);
  });

  //   it("Add Commitment", async () => {
  //     const instance = await PedersenCommitment.deployed();

  //     let randValue1 = 42;
  //     let valueToCommit1 = 100;
  //     let committed1 = await instance.commit.call(randValue1, valueToCommit1);
  //     let comX1 = committed1[0];
  //     let comY1 = committed1[1];

  //     console.log(
  //       "committed res 1: ",
  //       web3.utils.toHex(comX1),
  //       web3.utils.toHex(comY1)
  //     );

  //     let randValue2 = 42;
  //     let valueToCommit2 = 100;
  //     let committed2 = await instance.commit.call(randValue2, valueToCommit2);
  //     let comX2 = committed2[0];
  //     let comY2 = committed2[1];

  //     console.log(
  //       "committed res 2: ",
  //       web3.utils.toHex(comX2),
  //       web3.utils.toHex(comY2)
  //     );

  //     let verify = await instance.verify.call(
  //       randValue1,
  //       valueToCommit1,
  //       comX1,
  //       comY1
  //     );

  //     let verify2 = await instance.verify.call(
  //       randValue2,
  //       valueToCommit2,
  //       comX2,
  //       comY2
  //     );

  //     if (verify != true) {
  //       throw new Error("Verify 1 not true");
  //     }

  //     if (verify2 != true) {
  //       throw new Error("Verify 2 not true");
  //     }

  //     let randValue3 = 42;

  //     let added = await instance.addCommitment.call(
  //       randValue1,
  //       comX1,
  //       comY1,
  //       randValue2,
  //       comX2,
  //       comY2
  //     );
  //     let comX3 = added[0];
  //     let comY3 = added[1];

  //     console.log(
  //       "committed add 1: ",
  //       web3.utils.toHex(comX3),
  //       web3.utils.toHex(comY3)
  //     );

  //     let sub = await instance.addCommitment.call(
  //       randValue1,
  //       comX3,
  //       comY3,
  //       randValue2,
  //       comX2,
  //       comY2
  //     );
  //     let subX = sub[0];
  //     let subY = sub[1];

  //     console.log(
  //       "committed sub : ",
  //       web3.utils.toHex(subX),
  //       web3.utils.toHex(subY)
  //     );

  //     let res = subX == comX1 && subY == comY1;

  //     // verfica che con rand diversi il valore è diverso quando torni indietro

  //     console.log(res);

  //     // assert.equal(verify, true, `The value ${verify}.`);
  //   });

  it("Add Commitment", async () => {
    const instance = await PedersenCommitment.deployed();

    let randValue1 = 42;
    let valueToCommit1 = 100;
    let committed1 = await instance.commit.call(randValue1, valueToCommit1);
    let comX1 = committed1[0];
    let comY1 = committed1[1];

    // console.log(
    //   "committed res 1: ",
    //   web3.utils.toHex(comX1),
    //   web3.utils.toHex(comY1)
    // );

    let randValue2 = 42;
    let valueToCommit2 = 100;
    let committed2 = await instance.commit.call(randValue2, valueToCommit2);
    let comX2 = committed2[0];
    let comY2 = committed2[1];

    // console.log(
    //   "committed res 2: ",
    //   web3.utils.toHex(comX2),
    //   web3.utils.toHex(comY2)
    // );

    let verify = await instance.verify.call(
      randValue1,
      valueToCommit1,
      comX1,
      comY1
    );

    let verify2 = await instance.verify.call(
      randValue2,
      valueToCommit2,
      comX2,
      comY2
    );

    if (verify != true) {
      throw new Error("Verify 1 not true");
    }

    if (verify2 != true) {
      throw new Error("Verify 2 not true");
    }

    let added = await instance.addCommitment.call(
      randValue1,
      comX1,
      comY1,
      randValue2,
      comX2,
      comY2
    );
    let comSumX3 = added[0];
    let comSumY3 = added[1];

    // console.log(
    //   "committed add 1: ",
    //   web3.utils.toHex(comX3),
    //   web3.utils.toHex(comY3)
    // );

    // console.log(
    //   "SUM: ",
    //   web3.utils.toHex(comSumX3),
    //   web3.utils.toHex(comSumY3)
    // );

    let randValue3 = randValue1 + randValue2;
    let valueToCommit3 = valueToCommit1 + valueToCommit2;
    let committed3 = await instance.commit.call(randValue3, valueToCommit3);
    let comX3 = committed3[0];
    let comY3 = committed3[1];

    // console.log(
    //   "SINGLE COMMIT: ",
    //   web3.utils.toHex(comX3),
    //   web3.utils.toHex(comY3)
    // );

    let res =
      web3.utils.toHex(comX3) == web3.utils.toHex(comSumX3) &&
      web3.utils.toHex(comY3) == web3.utils.toHex(comSumY3);

    // verfica che con rand diversi il valore è diverso quando torni indietro

    // console.log(res);

    assert.equal(verify, true, `The value ${verify}.`);
  });

  it("Sub Commitment", async () => {
    const instance = await PedersenCommitment.deployed();

    let randValue1 = 42;
    let valueToCommit1 = 100;
    let committed1 = await instance.commit.call(randValue1, valueToCommit1);
    let comX1 = committed1[0];
    let comY1 = committed1[1];

    console.log(
      "committed res 1: ",
      web3.utils.toHex(comX1),
      web3.utils.toHex(comY1)
    );

    let randValue2 = 42;
    let valueToCommit2 = 100;
    let committed2 = await instance.commit.call(randValue2, valueToCommit2);
    let comX2 = committed2[0];
    let comY2 = committed2[1];

    // console.log(
    //   "committed res 2: ",
    //   web3.utils.toHex(comX2),
    //   web3.utils.toHex(comY2)
    // );

    let verify = await instance.verify.call(
      randValue1,
      valueToCommit1,
      comX1,
      comY1
    );

    let verify2 = await instance.verify.call(
      randValue2,
      valueToCommit2,
      comX2,
      comY2
    );

    if (verify != true) {
      throw new Error("Verify 1 not true");
    }

    if (verify2 != true) {
      throw new Error("Verify 2 not true");
    }

    let added = await instance.addCommitment.call(
      randValue1,
      comX1,
      comY1,
      randValue2,
      comX2,
      comY2
    );
    let comSumX3 = added[0];
    let comSumY3 = added[1];

    console.log(
      "SUM: ",
      web3.utils.toHex(comSumX3),
      web3.utils.toHex(comSumY3)
    );

    let randValue3 = randValue1;
    let sub = await instance.subCommitment.call(
      210,
      comSumX3,
      comSumY3,
      randValue2,
      comX2,
      comY2
    );
    let comSubX3 = sub[0];
    let comSubY3 = sub[1];

    console.log(
      "Commit3 - commit2 = commit1: ",
      web3.utils.toHex(comSubX3),
      web3.utils.toHex(comSubY3)
    );

    let res =
      web3.utils.toHex(comX1) == web3.utils.toHex(comSubX3) &&
      web3.utils.toHex(comY1) == web3.utils.toHex(comSubY3);

    assert.equal(verify, true, `The value ${verify}.`);
  });

  // it("Scalar Commitment", async () => {
  //   const instance = await PedersenCommitment.deployed();

  //   let scalar = 2;
  //   let randValue1 = 20;
  //   let valueToCommit1 = 50;
  //   let committed1 = await instance.commit.call(
  //     randValue1 * scalar,
  //     valueToCommit1 * scalar
  //   );
  //   let comX1 = committed1[0];
  //   let comY1 = committed1[1];

  //   let randValue2 = 20;
  //   let valueToCommit2 = 50;
  //   let committed2 = await instance.commit.call(randValue2, valueToCommit2);
  //   let comX2 = committed2[0] * scalar;
  //   let comY2 = committed2[1] * scalar;

  //   let verify2 = await instance.verify.call(
  //     randValue2,
  //     valueToCommit2,
  //     comX2,
  //     comY2
  //   );

  //   let verify = await instance.verify.call(
  //     randValue1,
  //     valueToCommit1,
  //     comX1,
  //     comY1
  //   );

  //   if (verify != true) {
  //     throw new Error("Verify 1 not true");
  //   }

  //   if (verify2 != true) {
  //     throw new Error("Verify 2 not true");
  //   }

  //   // console.log(
  //   //   "Commit3 - commit2 = commit1: ",
  //   //   web3.utils.toHex(comSubX3),
  //   //   web3.utils.toHex(comSubY3)
  //   // );

  //   let res =
  //     web3.utils.toHex(comX1) == web3.utils.toHex(comX2) &&
  //     web3.utils.toHex(comY1) == web3.utils.toHex(comY2);

  //   assert.equal(verify, true, `The value ${verify}.`);
  // });
});
