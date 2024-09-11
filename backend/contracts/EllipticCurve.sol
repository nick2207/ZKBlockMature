// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "./EllipticCurveOperations.sol";

contract EllipticCurve is EllipticCurveOperations {
    uint256 public mod =
        uint256(
            0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
        );
    uint256 public size =
        uint256(
            0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
        ); // curve's order
    uint256 public generatorX =
        uint256(
            0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798
        ); // x coordinate of a point
    uint256 public generatorY =
        uint256(
            0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8
        ); // y coordinate of a point
    uint256 public curveConst =
        uint256(
            0x0000000000000000000000000000000000000000000000000000000000000000
        );
    uint256 public curveConstB =
        uint256(
            0x0000000000000000000000000000000000000000000000000000000000000007
        );

    function ellipticAdd(
        uint256 x1,
        uint256 y1,
        uint256 x2,
        uint256 y2
    ) public returns (uint256, uint256) {
        (uint256 x, uint256 y) = affineAddition(
            x1,
            y1,
            x2,
            y2,
            curveConst,
            mod
        );
        return (x, y);
    }

    function ellipticSub(
        uint256 x1,
        uint256 y1,
        uint256 x2,
        uint256 y2
    ) public returns (uint256, uint256) {
        (uint256 x, uint256 y) = affineSub(x1, y1, x2, y2, curveConst, mod);
        return (x, y);
    }

    function ellipticMul(
        uint256 scalar,
        uint256 x,
        uint256 y
    ) public returns (uint256, uint256) {
        (uint256 x, uint256 y) = affineMul(x, y, scalar, curveConst, mod);
        return (x, y);
    }
}
