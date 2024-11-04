// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

/**
 * @title EllipticCurveOperations
 * @dev Contains essential elliptic curve arithmetic functions in modular arithmetic.
 */
contract EllipticCurveOperations {
    
   /**
     * @dev Calculates modular inverse using the Extended Euclidean Algorithm.
     * @param value The value to invert
     * @param mod The modulus
     * @return The modular inverse of `value` under `mod`
     */
    function modInverse(
        uint256 value,
        uint256 mod
    ) public pure returns (uint256) {
        require(value != 0 && mod > 1 && value != mod, "Invalid input values");

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

            // (coefficient_value, coefficient_mod) = (coefficient_mod, ( coefficient_value + (mod - ((quotient * coefficient_mod) % mod) )) % mod );
            // meno precisi  (coefficient_value, coefficient_mod) = (coefficient_mod, addmod( coefficient_value, ( mod - mulmod(quotient, coefficient_mod, mod) ), mod ) );
            (coefficient_value, coefficient_mod) = (
                coefficient_mod,
                addmod(
                    coefficient_value,
                    addmod(
                        mod - mulmod(quotient, coefficient_mod, mod),
                        0,
                        mod
                    ),
                    mod
                )
            );

            // r1 - q * r2 is the remainder
            // not sure if mulmod is needed. previous operation was (dividend, remainder) = (remainder, dividend - quotient, remainder );
            // less precise (dividend, remainder) = (remainder, dividend - mulmod(quotient, remainder, mod) );
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

        return result;
    }

    /**
     * @dev Computes the inverse of a point (x, y) on the elliptic curve.
     * @param x x-coordinate of the point
     * @param y y-coordinate of the point
     * @param mod The modulus
     * @return (x, -y mod p) - The inverse point on the curve
     */
    function pointInverse(
        uint256 x,
        uint256 y,
        uint256 mod
    ) public pure returns (uint256, uint256) {
        // return (x, (mod - y) % mod);
        return (x, addmod(mod - y, 0, mod));
    }

    /**
     * @dev Checks if the point (x, y) lies on the elliptic curve defined by y^2 = x^3 + ax + b.
     * @param x x-coordinate of the point
     * @param y y-coordinate of the point
     * @param a Coefficient of x in the curve equation
     * @param b Constant term in the curve equation
     * @param mod The modulus
     * @return True if the point is on the curve; false otherwise
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

        lhs = mulmod(y, y, mod);
        rhs = mulmod(mulmod(x, x, mod), x, mod);

        // rhs + ax
        if (a != 0) {
            rhs = addmod(rhs, mulmod(a, x, mod), mod);
        }

        // rhs + b
        if (b != 0) {
            rhs = addmod(rhs, b, mod);
        }

        return lhs == rhs;
    }

    /**
     * @dev Converts Jacobian coordinates (X, Y, Z) to affine coordinates.
     * @param x x-coordinate in Jacobian
     * @param y y-coordinate in Jacobian
     * @param z z-coordinate in Jacobian
     * @param mod The modulus
     * @return (x, y) - Affine coordinates
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

        if (z == 0) return (0, 0); // Return point at infinity if z is 0

        z_inv = modInverse(z, mod);
        z_squared = mulmod(z_inv, z_inv, mod);
        z_cubed = mulmod(z_inv, z_squared, mod);
        x_affine = mulmod(x, z_squared, mod);
        y_affine = mulmod(y, z_cubed, mod);
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
    /**
     * @dev Adds two points in Jacobian coordinates: (x1, y1, z1) + (x2, y2, z2).
     * @param x1 x-coordinate of the first point
     * @param y1 y-coordinate of the first point
     * @param z1 z-coordinate of the first point (1 for affine points)
     * @param x2 x-coordinate of the second point
     * @param y2 y-coordinate of the second point
     * @param z2 z-coordinate of the second point (1 for affine points)
     * @param mod The modulus
     * @return (x3, y3, z3) - Resulting point in Jacobian coordinates after addition
     */
    function jacobianAddition(
        uint256 x1,
        uint256 y1,
        uint256 z1,
        uint256 x2,
        uint256 y2,
        uint256 z2,
        uint256 mod
    ) public pure returns (uint256, uint256, uint256) {

        jacAddTempVar memory temp;

        uint256 newX;
        uint256 newY;
        uint256 newZ;

        // add some checks !!!
        if (x1 == 0 && y1 == 0) {
            return (x2, y2, z2);
        }
        if (x2 == 0 && y2 == 0) {
            return (x1, y1, z1);
        }

        temp.z1Squared = mulmod(z1, z1, mod);
        temp.z2Squared = mulmod(z2, z2, mod);

        temp.z1Cubed = mulmod(z1, temp.z1Squared, mod);
        temp.z2Cubed = mulmod(z2, temp.z2Squared, mod);

        temp.u1 = mulmod(x1, temp.z2Squared, mod);
        temp.u2 = mulmod(x2, temp.z1Squared, mod);

        temp.s1 = mulmod(y1, temp.z2Cubed, mod);
        temp.s2 = mulmod(y2, temp.z1Cubed, mod);

        temp.h = addmod(temp.u2, addmod(mod - temp.u1, 0, mod), mod);
        // addmod(zs[2], pp - zs[0], pp)
        temp.r = addmod(temp.s2, addmod(mod - temp.s1, 0, mod), mod);

        temp.rSquared = mulmod(temp.r, temp.r, mod);
        temp.hSquared = mulmod(temp.h, temp.h, mod);
        temp.hCubed = mulmod(temp.h, mulmod(temp.h, temp.h, mod), mod);

        // newX = ( ((temp.rSquared + (mod - temp.hCubed) ) ) + (mod - (2 * (temp.u1 * temp.hSquared)%mod)  ) ) % mod;
        newX = addmod(
            (addmod(temp.rSquared, (mod - temp.hCubed), mod)),
            (mod - mulmod(2, mulmod(temp.u1, temp.hSquared, mod), mod)),
            mod
        );
        // newY = ( (temp.r * (temp.u1 * temp.hSquared + (mod-newX) ) ) + (mod - (temp.s1 * temp.hCubed)%mod ) ) % mod;
        newY = addmod(
            mulmod(
                temp.r,
                addmod(mulmod(temp.u1, temp.hSquared, mod), (mod - newX), mod),
                mod
            ),
            (mod - mulmod(temp.s1, temp.hCubed, mod)),
            mod
        );
        //newZ = (temp.h * z1 * z2) % mod;
        newZ = mulmod(mulmod(temp.h, z1, mod), z2, mod);

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

    /**
     * @dev Doubles a point in Jacobian coordinates: 2 * (x, y, z).
     * @param x x-coordinate of the point
     * @param y y-coordinate of the point
     * @param z z-coordinate of the point
     * @param curveConst Curve constant in the equation y^2 = x^3 + ax + b
     * @param mod The modulus
     * @return (x3, y3, z3) - Resulting point in Jacobian coordinates after doubling
     */
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
        temp.xSquared = mulmod(x, x, mod);
        temp.ySquared = mulmod(y, y, mod);
        temp.zFourth = mulmod(mulmod(z, z, mod), mulmod(z, z, mod), mod);

        temp.s = mulmod(4, mulmod(x, temp.ySquared, mod), mod);
        temp.m = addmod(
            mulmod(3, temp.xSquared, mod),
            mulmod(curveConst, temp.zFourth, mod),
            mod
        );

        temp.mSquared = mulmod(temp.m, temp.m, mod);
        temp.yFourth = mulmod(temp.ySquared, temp.ySquared, mod);

        newX = addmod(
            temp.mSquared,
            addmod(mod - mulmod(2, temp.s, mod), 0, mod),
            mod
        );
        newY = addmod(
            mulmod(temp.m, addmod(temp.s, (mod - newX), mod), mod),
            (mod - mulmod(8, temp.yFourth, mod)),
            mod
        );
        newZ = mulmod(2, mulmod(y, z, mod), mod);

        return (newX, newY, newZ);
    }

    struct jacMulTempVar {
        uint256 remaining;
        uint256 scalar;
        uint256 xCopy;
        uint256 yCopy;
        uint256 zCopy;
    }

    /**
     * @dev Multiplies a point (x, y, z) in Jacobian coordinates by a scalar `scalar`.
     * Uses the double-and-add algorithm to perform scalar multiplication on the elliptic curve.
     * @param x The x-coordinate of the point in Jacobian form
     * @param y The y-coordinate of the point in Jacobian form
     * @param z The z-coordinate of the point in Jacobian form
     * @param scalar The scalar to multiply by
     * @param curveConst The curve constant (usually 'a' in the elliptic curve equation)
     * @param mod The modulus (typically the field prime)
     * @return (xResult, yResult, zResult) - The resulting point in Jacobian coordinates after multiplication
    */
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


    /**
     * @dev Adds two points (x1, y1) and (x2, y2) in affine coordinates.
     * @param x1 x-coordinate of the first point
     * @param y1 y-coordinate of the first point
     * @param x2 x-coordinate of the second point
     * @param y2 y-coordinate of the second point
     * @param mod The modulus (typically the field prime)
     * @return (x3, y3) - The resulting point after addition in affine coordinates
     */
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

    
    /**
     * @dev Subtracts point (x2, y2) from point (x1, y1) in affine coordinates.
     * The result is computed as (x3, y3) = (x1, y1) + (-x2, y2).
     * @param x1 The x-coordinate of the first point
     * @param y1 The y-coordinate of the first point
     * @param x2 The x-coordinate of the second point
     * @param y2 The y-coordinate of the second point
     * @param curveConst The curve constant (usually 'a' in the elliptic curve equation)
     * @param mod The modulus (typically the field prime)
     * @return (x3, y3) - The resulting point coordinates after subtraction
    */
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

    /**
     * @dev Multiplies a point (x, y) by a scalar using affine coordinates.
     * This function uses the double-and-add algorithm for scalar multiplication.
     * @param x The x-coordinate of the point to be multiplied
     * @param y The y-coordinate of the point to be multiplied
     * @param scalar The scalar by which to multiply the point
     * @param curveConst The curve constant (usually 'a' in the elliptic curve equation)
     * @param mod The modulus (typically the field prime)
     * @return (xRes, yRes) - The resulting point coordinates after multiplication
    */
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
