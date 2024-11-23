const EllipticCurve = artifacts.require("EllipticCurve");

contract("ElliptiCurve", (accounts) => {
  it("Addition", async () => {
    const instance = await EllipticCurve.deployed();

    // trovare due punti appartenti alla curva
    // sommarli
    // verificare che appartenga ancora alla curva

    let x1 = "1";
    let y1 =
      "29896722852569046015560700294576055776214335159245303116488692907525646231534";
    let x2 = "1";
    let y2 =
      "85895366384747149408010284714111852077055649506395260922968891100383188440129";

    // let x1BN = web3.utils.toBN(x1);
    // let y1BN = web3.utils.toBN(y1);
    // let x2BN = web3.utils.toBN(x2);
    // let y2BN = web3.utils.toBN(y2);
    let xRes;
    let yRes;
    // console.log(x2BN);
    let res = await instance.ellipticAdd.call(x1, y1, x2, y2);
    xRes = res[0];
    yRes = res[1];
    // let is = web3.utils.isBN(res[1]);
    // console.log(web3.utils.hexToNumberString(web3.utils.toHex(res[0])));
    // console.log(web3.utils.hexToNumberString(web3.utils.toHex(res)));
    // let xRes = res[0].toHex();
    // let yRes = res[1].toHex();

    let a = await instance.curveConst.call();
    let b = await instance.curveConstB.call();
    let mod = await instance.mod.call();
    // let test = web3.utils.toHex(mod);

    a = web3.utils.toHex(a);
    a = web3.utils.toBN(a);

    b = web3.utils.toHex(b);
    b = web3.utils.toBN(b);

    mod = web3.utils.toHex(mod);
    mod = web3.utils.toBN(mod);

    res = await instance.isOnCurve(xRes, yRes, a, b, mod);
    // consolelog(res);

    assert.equal(res, true, `The value is not belonging to the curve.`);
  });

  it("Sub", async () => {
    const instance = await EllipticCurve.deployed();

    // trovare due punti appartenti alla curva
    // sommarli
    // verificare che appartenga ancora alla curva

    let x1 = "1";
    let y1 =
      "29896722852569046015560700294576055776214335159245303116488692907525646231534";
    let x2 = "1";
    let y2 =
      "85895366384747149408010284714111852077055649506395260922968891100383188440129";

    // console.log(x2BN);
    let res = await instance.ellipticSub.call(x1, y1, x2, y2);
    let xRes = res[0];
    let yRes = res[1];

    let a = await instance.curveConst.call();
    let b = await instance.curveConstB.call();
    let mod = await instance.mod.call();
    // let test = web3.utils.toHex(mod);

    a = web3.utils.toHex(a);
    a = web3.utils.toBN(a);

    b = web3.utils.toHex(b);
    b = web3.utils.toBN(b);

    mod = web3.utils.toHex(mod);
    mod = web3.utils.toBN(mod);

    res = await instance.isOnCurve(xRes, yRes, a, b, mod);
    // consolelog(res);

    assert.equal(res, true, `The value is not belonging to the curve.`);
  });

  it("Mul", async () => {
    const instance = await EllipticCurve.deployed();

    let scalar = "20";
    let x1 = "1";
    let y1 =
      "29896722852569046015560700294576055776214335159245303116488692907525646231534";

    let res = await instance.ellipticMul.call(scalar, x1, y1);
    let xRes = res[0];
    let yRes = res[1];

    let a = await instance.curveConst.call();
    let b = await instance.curveConstB.call();
    let mod = await instance.mod.call();
    // let test = web3.utils.toHex(mod);

    a = web3.utils.toHex(a);
    a = web3.utils.toBN(a);

    b = web3.utils.toHex(b);
    b = web3.utils.toBN(b);

    mod = web3.utils.toHex(mod);
    mod = web3.utils.toBN(mod);

    res = await instance.isOnCurve(xRes, yRes, a, b, mod);

    assert.equal(res, true, `The value is not belonging to the curve.`);
  });
});
