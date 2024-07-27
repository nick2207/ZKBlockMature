// SPDX-License-Identifier: MIT

pragma solidity 0.8.21;

contract EllipticCurveOperations {
    /*
        value:uint256 -> value of which to find the modular inverse
        mod:uint256 -> value of the modulus
    */
    function modInverse(
        uint256 value,
        uint256 mod
    ) public pure returns (uint256) {
        if (value == 0 || mod <= 1 || value == mod) {
            revert(
                "Numbers are not valid for one of the following reasons: 1. Value to be inverted is zero.\nModulus is <= 1.\nValue and modulus have are same."
            );
        }

        // ax + by = 1 => (coefficient_value * value) + (coefficient_mod * mod) = 1

        uint256 coefficient_value = 0;
        uint256 coefficient_mod = 1;

        uint256 remainder = value;
        uint256 dividend = mod;
        uint256 quotient;
        uint256 result;

        while (remainder != 0) {
            quotient = dividend / remainder; // mod/value

            // [x = t1] => t1 = t2 is equale to x = y
            // [t2 = y] => t2 = t1 - q*t2 equal to  y = x - qy

            (coefficient_value, coefficient_mod) = (
                coefficient_mod,
                ((coefficient_value +
                    (mod - ((quotient * coefficient_mod) % mod))) % mod)
            );

            // r1 - q * r2 is the remainder
            (dividend, remainder) = (
                remainder,
                dividend - quotient * remainder
            );
        }

        if (coefficient_value >= 0) {
            result = coefficient_value;
        } else {
            coefficient_value + mod;
        }
        //  console.log("Before return");

        return result;
    }

    /*
        Calcuates the inverse of a point on X axis
    */
    function pointInverse(
        uint256 x,
        uint256 y,
        uint256 mod
    ) public pure returns (uint256, uint256) {
        return (x, (mod - y) % mod);
    }

    /*
        This function verifies that a point (x,y) is on curve (y^2 = x^3 + ax + b)
    */
    function isOnCurve(
        uint256 x,
        uint256 y,
        uint256 a,
        uint256 b,
        uint256 mod
    ) public pure returns (bool) {
        if (x == 0 || x == mod || y == 0 || y == mod) {
            return false;
        }

        uint256 lhs;
        uint256 rhs;

        lhs = (y ** 2) % mod;
        rhs = (x ** 3) % mod;

        // rhs + ax
        if (a != 0) {
            rhs = (rhs + a * x) % mod;
        }

        // rhs + b
        if (b != 0) {
            rhs = (rhs + b) % mod;
        }

        return lhs == rhs;
    }

    /*
        This function convets Jacobian coordinates to affine coordinates
    */
    function toAffine(
        uint256 x,
        uint256 y,
        uint256 z,
        uint256 mod
    ) public pure returns (uint256, uint256) {
        uint256 z_inv;
        uint256 z_squared;
        uint256 z_cubed;
        uint256 x_affine;
        uint256 y_affine;

        z_inv = modInverse(z, mod);
        z_squared = (z_inv ** 2) % mod;
        z_cubed = (z_inv ** 3) % mod;
        x_affine = (x * z_squared) % mod;
        y_affine = (y * z_cubed) % mod;
        return (x_affine, y_affine);
    }

    struct jacAddTempVar {
        uint256 z1Squared;
        uint256 z2Squared;
        uint256 z1Cubed;
        uint256 z2Cubed;
        uint256 u1;
        uint256 u2;
        uint256 s1;
        uint256 s2;
        uint256 h;
        uint256 r;
        uint256 rSquared;
        uint256 hSquared;
        uint256 hCubed;
    }

    function jacobianAddition(
        uint256 x1,
        uint256 y1,
        uint256 z1,
        uint256 x2,
        uint256 y2,
        uint256 z2,
        uint256 mod
    ) public pure returns (uint256, uint256, uint256) {
        // add some checks !!!

        jacAddTempVar memory temp;

        uint256 newX;
        uint256 newY;
        uint256 newZ;

        if (x1 == 0 && y1 == 0) {
            return (x2, y2, z2);
        }
        if (x2 == 0 && y2 == 0) {
            return (x1, y1, z1);
        }

        temp.z1Squared = (z1 ** 2) % mod;
        temp.z2Squared = (z2 ** 2) % mod;

        temp.z1Cubed = (z1 ** 3) % mod;
        temp.z2Cubed = (z2 ** 3) % mod;

        temp.u1 = (x1 * temp.z2Squared) % mod;
        temp.u2 = (x2 * temp.z1Squared) % mod;

        temp.s1 = (y1 * temp.z2Cubed) % mod;
        temp.s2 = (y2 * temp.z1Cubed) % mod;

        temp.h = (temp.u2 + (mod - temp.u1)) % mod;
        // addmod(zs[2], pp - zs[0], pp)
        temp.r = (temp.s2 + (mod - temp.s1)) % mod;

        temp.rSquared = (temp.r ** 2) % mod;
        temp.hSquared = (temp.h ** 2) % mod;
        temp.hCubed = (temp.h ** 3) % mod;

        newX =
            (((temp.rSquared + (mod - temp.hCubed))) +
                (mod - ((2 * (temp.u1 * temp.hSquared)) % mod))) %
            mod;
        newY =
            ((temp.r * (temp.u1 * temp.hSquared + (mod - newX))) +
                (mod - ((temp.s1 * temp.hCubed) % mod))) %
            mod;
        newZ = (temp.h * z1 * z2) % mod;

        return (newX, newY, newZ);
    }

    struct jacDoubleTempVar {
        uint256 xSquared;
        uint256 ySquared;
        uint256 zFourth;
        uint256 yFourth;
        uint256 s;
        uint256 m;
        uint256 mSquared;
    }

    function jacobianDouble(
        uint256 x,
        uint256 y,
        uint256 z,
        uint256 curveConst,
        uint256 mod
    ) public pure returns (uint256, uint256, uint256) {
        jacDoubleTempVar memory temp;
        uint256 newX;
        uint256 newY;
        uint256 newZ;

        if (z == 0) {
            return (x, y, z);
        }
        // check that y not zero otherwise is infinite point
        temp.xSquared = (x ** 2) % mod;
        temp.ySquared = (y ** 2) % mod;
        temp.zFourth = (z ** 4) % mod;

        temp.s = (4 * x * temp.ySquared) % mod;
        temp.m = ((3 * temp.xSquared) + (curveConst * temp.zFourth)) % mod;

        temp.mSquared = (temp.m ** 2) % mod;
        temp.yFourth = (temp.ySquared ** 2) % mod;

        newX = (temp.mSquared + (mod - ((2 * temp.s) % mod))) % mod;
        newY =
            (((temp.m * (temp.s + ((mod - newX) % mod))) % mod) +
                (mod - ((8 * temp.yFourth) % mod))) %
            mod;
        newZ = (2 * ((y * z) % mod)) % mod;

        return (newX, newY, newZ);
    }

    struct jacMulTempVar {
        uint256 remaining;
        uint256 scalar;
        uint256 xCopy;
        uint256 yCopy;
        uint256 zCopy;
    }

    function jacobianMultiplication(
        uint256 x,
        uint256 y,
        uint256 z,
        uint256 scalar,
        uint256 curveConst,
        uint256 mod
    ) public pure returns (uint256, uint256, uint256) {
        jacMulTempVar memory temp;

        temp.remaining = scalar;
        temp.xCopy = x;
        temp.yCopy = y;
        temp.zCopy = z;

        x = 0;
        y = 0;
        z = 1;

        if (scalar == 0) {
            return (0, 0, 1);
        }

        while (temp.remaining != 0) {
            if ((temp.remaining & 1) != 0) {
                // P = P+t
                (x, y, z) = jacobianAddition(
                    x,
                    y,
                    z,
                    temp.xCopy,
                    temp.yCopy,
                    temp.zCopy,
                    mod
                );
            }
            temp.remaining = temp.remaining / 2;
            // t = 2*t
            (temp.xCopy, temp.yCopy, temp.zCopy) = jacobianDouble(
                temp.xCopy,
                temp.yCopy,
                temp.zCopy,
                curveConst,
                mod
            );
        }

        return (x, y, z);
    }

    function affineAddition(
        uint256 x1,
        uint256 y1,
        uint256 x2,
        uint256 y2,
        uint256 curveConst,
        uint256 mod
    ) public pure returns (uint256, uint256) {
        uint256 xAffine;
        uint256 yAffine;

        uint256 xRes;
        uint256 yRes;
        uint256 zRes;

        if (x1 == x2) {
            (xRes, yRes, zRes) = jacobianDouble(x1, y1, 1, curveConst, mod);
        } else {
            (xRes, yRes, zRes) = jacobianAddition(x1, y1, 1, x2, y2, 1, mod);
        }

        (xAffine, yAffine) = toAffine(xRes, yRes, zRes, mod);
        return (xAffine, yAffine);
    }

    function affineSub(
        uint256 x1,
        uint256 y1,
        uint256 x2,
        uint256 y2,
        uint256 curveConst,
        uint256 mod
    ) public pure returns (uint256, uint256) {
        uint256 xAffine;
        uint256 yAffine;

        uint256 xInv;
        uint256 yInv;

        (xInv, yInv) = pointInverse(x2, y2, mod);

        (xAffine, yAffine) = affineAddition(
            x1,
            y1,
            xInv,
            yInv,
            curveConst,
            mod
        );

        return (xAffine, yAffine);
    }

    function affineMul(
        uint256 x,
        uint256 y,
        uint256 scalar,
        uint256 curveConst,
        uint256 mod
    ) public pure returns (uint256, uint256) {
        uint256 xRes;
        uint256 yRes;
        uint256 zRes;
        uint256 xAffine;
        uint256 yAffine;

        (xRes, yRes, zRes) = jacobianMultiplication(
            x,
            y,
            1,
            scalar,
            curveConst,
            mod
        );

        (xAffine, yAffine) = toAffine(xRes, yRes, zRes, mod);

        return (xAffine, yAffine);
    }
}
