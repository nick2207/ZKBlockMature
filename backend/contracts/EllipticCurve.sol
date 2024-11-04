// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "./EllipticCurveOperations.sol";

/**
 * @title EllipticCurve
 * @dev Provides elliptic curve operations over a specific curve.
 */
contract EllipticCurve is EllipticCurveOperations {
    // Define curve constants: the secp256k1 parameters
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

    
     /**
     * @dev Adds two points (x1, y1) and (x2, y2) on the elliptic curve.
     * @param x1 x-coordinate of the first point
     * @param y1 y-coordinate of the first point
     * @param x2 x-coordinate of the second point
     * @param y2 y-coordinate of the second point
     * @return (x, y) - Coordinates of the resulting point after addition
     */
    function ellipticAdd(
        uint256 x1,
        uint256 y1,
        uint256 x2,
        uint256 y2
    ) public view
returns (uint256, uint256) {
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

    /**
     * @dev Subtracts two points (x1, y1) - (x2, y2) on the elliptic curve.
     * @param x1 x-coordinate of the first point
     * @param y1 y-coordinate of the first point
     * @param x2 x-coordinate of the second point
     * @param y2 y-coordinate of the second point
     * @return (x, y) - Coordinates of the resulting point after subtraction
     */
    function ellipticSub(
        uint256 x1,
        uint256 y1,
        uint256 x2,
        uint256 y2
    ) public view
returns (uint256, uint256) {
        (uint256 x, uint256 y) = affineSub(x1, y1, x2, y2, curveConst, mod);
        return (x, y);
    }

    /**
     * @dev Multiplies a point (x, y) by a scalar on the elliptic curve.
     * @param scalar The scalar to multiply
     * @param x x-coordinate of the point
     * @param y y-coordinate of the point
     * @return (x, y) - Coordinates of the resulting point after multiplication
     */
    function ellipticMul(
        uint256 scalar,
        uint256 x,
        uint256 y
    ) public view
returns (uint256, uint256) {
        (x, y) = affineMul(x, y, scalar, curveConst, mod);
        return (x, y);
    }
}
