const EllipticCurveOperations = artifacts.require("EllipticCurveOperations");

contract("ElliptiCurveOP", (accounts) => {
  it("Mod Inverse", async () => {
    const instance = await EllipticCurveOperations.deployed();

    let values = [
      {
        mod: "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f",
        value: "7",
        result:
          "0xdb6db6db6db6db6db6db6db6db6db6db6db6db6db6db6db6db6db6da9249214d",
      },
      {
        mod: "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f",
        value: "33379282",
        result:
          "0xd852a75b009bfd729ae0336edab72653a83439e205262f79db0e982cc448a5fb",
      },
      {
        mod: "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f",
        value: "7474364838373339303934334844772828829237478493405555555555555",
        result:
          "0x93e0828bd5bb8188e955b637ec9c9a302537c085c11afe40c8221ab8963f06f2",
      },
      {
        mod: "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f",
        value: "747436483837333930394844772828829237478493405555555555555",
        result:
          "0x825ec28c0e35faf5d4c727a64b4d4d8c39ca3ad1998947de554fd1ac83597a8f",
      },
    ];

    let correctMatch = 0;
    for (let i = 0; i < values.length; i++) {
      let e = values[i];
      let valueBN = web3.utils.toBN(e["value"]);
      let modBN = web3.utils.toBN(e["mod"]);

      let inverse = await instance.modInverse(valueBN, modBN, {
        from: accounts[0],
      });
      let hexInverse = web3.utils.toHex(inverse);
      // devo mettere uguale e contare i risultati
      if (hexInverse.toString() == e["result"]) {
        correctMatch += 1;
      } else {
        console.log(
          `The value ${hexInverse.toString()} is wrong. Should be ${
            e["result"]
          }`
        );
      }
    }
    assert.equal(
      values.length,
      correctMatch,
      `The value ${correctMatch.toString()} is wrong.`
    );
  });

  /*
    Results taken from https://asecuritysite.com/encryption/ecc_points_real
  */
  it("isOnCurve", async () => {
    const instance = await EllipticCurveOperations.deployed();

    let a = 0;
    let b = 7;
    let mod = 37;
    let trueRes = 0;
    let values = [
      [3, 16],
      [4, 16],
      [5, 13],
      [6, 1],
      [8, 1],
      [9, 12],
      [12, 12],
      [13, 13],
      [16, 12],
      [17, 6],
      [18, 17],
      [19, 13],
      [22, 6],
      [23, 1],
      [24, 17],
      [30, 16],
      [32, 17],
      [35, 6],
    ];
    for (let i = 0; i < values.length; i++) {
      let e = values[i];
      let x = e[0];
      let y = e[1];
      let isOnCurveResult = await instance.isOnCurve(x, y, a, b, mod, {
        from: accounts[0],
      });
      if (isOnCurveResult) trueRes += 1;
    }
    assert.equal(
      values.length,
      trueRes,
      `The number of points belonging to the curve should be ${values.length.toString()} instead of ${trueRes.toString()}.`
    );
  });

  it("toAffine", async () => {
    const instance = await EllipticCurveOperations.deployed();

    res = await instance.toAffine(44, 4, 23, 9);
    // console.log(`The res is: ${res[0]} ${res[1]}`);
    x = res[0].toString();
    y = res[1].toString();

    check = x == "5" && y == "5";

    assert.equal(check, true, `The res should be 5, 5.`);
  });

  it("jacobainAddition", async () => {
    const instance = await EllipticCurveOperations.deployed();

    res = await instance.jacobianAddition(1, 22, 3, 4, 5, 3, 7);
    pythonRes = [6, 1, 5];
    let check = 0;
    for (let i = 0; i < pythonRes.length; i++) {
      // console.log(`The res is: ${res[i]}`);
      if (res[i].toNumber() == pythonRes[i]) check += 1;
    }
    assert.equal(check, 3);
  });

  it("jacobainDouble", async () => {
    const instance = await EllipticCurveOperations.deployed();

    res = await instance.jacobianDouble(1, 22, 3, 2, 5);
    pythonRes = [3, 2, 2];
    let check = 0;
    for (let i = 0; i < pythonRes.length; i++) {
      // console.log(`The res is: ${res[i]}`);
      if (res[i].toNumber() == pythonRes[i]) check += 1;
    }
    assert.equal(check, pythonRes.length);
  });

  it("jacobianMultiplication", async () => {
    const instance = await EllipticCurveOperations.deployed();

    res = await instance.jacobianMultiplication(1, 22, 3, 10, 5, 7);
    pythonRes = [5, 1, 2];
    let check = 0;
    for (let i = 0; i < pythonRes.length; i++) {
      // console.log(`The res is: ${res[i]}`);
      if (res[i].toNumber() == pythonRes[i]) check += 1;
    }
    assert.equal(check, pythonRes.length);
  });

  it("affineAddition", async () => {
    const instance = await EllipticCurveOperations.deployed();

    res = await instance.affineAddition(1, 22, 4, 5, 7, 13);
    pythonRes = [4, 8];
    let check = 0;
    for (let i = 0; i < pythonRes.length; i++) {
      // console.log(`The res is: ${res[i]}`);
      if (res[i].toNumber() == pythonRes[i]) check += 1;
    }
    assert.equal(check, pythonRes.length);
  });

  it("affineSub", async () => {
    const instance = await EllipticCurveOperations.deployed();

    res = await instance.affineSub(1, 22, 4, 5, 7, 13);
    pythonRes = [11, 3];
    let check = 0;
    for (let i = 0; i < pythonRes.length; i++) {
      // console.log(`The res is: ${res[i]}`);
      if (res[i].toNumber() == pythonRes[i]) check += 1;
    }
    assert.equal(check, pythonRes.length);
  });

  it("affineMul", async () => {
    const instance = await EllipticCurveOperations.deployed();

    res = await instance.affineMul(1, 22, 8, 7, 13);
    pythonRes = [11, 8];
    let check = 0;
    for (let i = 0; i < pythonRes.length; i++) {
      // console.log(`The res is: ${res[i]}`);
      if (res[i].toNumber() == pythonRes[i]) check += 1;
    }
    assert.equal(check, pythonRes.length);
  });
});
