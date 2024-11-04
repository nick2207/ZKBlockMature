// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "./EllipticCurve.sol";

contract PedersenCommitment is EllipticCurve {
    event LogSender(address indexed sender);
    event LogVal(uint256 indexed sender);
    event LogCommitment(uint256 indexed txId, uint256 x, uint256 y);

    uint256 public GeneratorRandomPoint;

    mapping(uint256 => Commit) public commitments; // Mapping for storing commitments by transaction ID

    struct Commit {
        uint256 x;
        uint256 y;
    }

    // Ensure the generator point is set only once
    modifier isPointSet() {
        require(GeneratorRandomPoint == 0, "Cannot set the generator more than once");
        _;
    }

    /**
     * @dev Sets the generator point for the commitment scheme.
     * This can only be done once.
     */
    function setPoint() public isPointSet {
        uint256 randomValue = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender))
        );
        GeneratorRandomPoint = randomValue % mod;
        // emit LogSender(msg.sender);
    }

    /**
     * to be removed and use default getter and setter
     */
    /**
     * @dev Returns the current value of the generator point.
     * Emits a log of the value when called.
     * @return The value of the generator point.
     */
    function getPoint() public returns (uint256) {
        emit LogVal(GeneratorRandomPoint);
        return GeneratorRandomPoint;
    }


    /**
     * @dev Creates a commitment based on the provided random value and input value.
     * This commitment is stored and can be verified later.
     * @param randomValue A random value used in the commitment.
     * @param value The value to be committed.
     * @return (x, y) The coordinates of the resulting commitment.
     */
    function commit(
        uint256 randomValue,
        uint256 value
    ) public returns (uint256, uint256) {

        (uint256 senderRandomX, uint256 senderRandomY) = ellipticMul(
            GeneratorRandomPoint,
            generatorX,
            generatorY
        );
        (uint256 x1, uint256 y1) = ellipticMul(
            value,
            senderRandomX,
            senderRandomY
        );
        (uint256 x2, uint256 y2) = ellipticMul(
            randomValue,
            generatorX,
            generatorY
        );
        (uint256 x, uint256 y) = ellipticAdd(x1, y1, x2, y2);

        uint256 txId = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender))); // generate transaction ID
        commitments[txId] = Commit(x, y);

        emit LogCommitment(txId, x, y); // Emit log for the new commitment
        return (x, y);
    }

    
    /**
     * @dev Verifies if a given random value and input value match the stored commitment for a transaction ID.
     * @param randomValue The random value used in the original commitment.
     * @param value The original value committed.
     * @param txId The transaction ID of the stored commitment.
     * @return True if the commitment matches, otherwise false.
     */
    function verify(
        uint256 randomValue,
        uint256 value,
        uint256 txId
    ) public returns (bool) {
        require(GeneratorRandomPoint != 0, "Generator is not set"); 
        Commit memory storedCommit = commitments[txId];
        require(storedCommit.x != 0 || storedCommit.y != 0, "No commitment found for this transaction ID");


        uint256 xCheck;
        uint256 yCheck;
        (xCheck, yCheck) = commit(randomValue, value); // Recompute commitment for verification
        
        // Check if the recomputed commitment matches the stored one
        if ((xCheck == storedCommit.x) && (yCheck == storedCommit.y)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Adds two commitments together and returns the new commitment and its random value.
     * @param randomValue1 The random value associated with the first commitment.
     * @param x1 The x-coordinate of the first commitment.
     * @param y1 The y-coordinate of the first commitment.
     * @param randomValue2 The random value associated with the second commitment.
     * @param x2 The x-coordinate of the second commitment.
     * @param y2 The y-coordinate of the second commitment.
     * @return (x3, y3, randomValue3) The new commitment's coordinates and associated random value.
     */
    function addCommitment(
        uint256 randomValue1,
        uint256 x1,
        uint256 y1,
        uint256 randomValue2,
        uint256 x2,
        uint256 y2
    ) public returns (uint256, uint256, uint256) {
        uint256 randomValue3;
        uint256 x3;
        uint256 y3;

        randomValue3 = addmod(randomValue1, randomValue2, mod);
        (x3, y3) = ellipticAdd(x1, y1, x2, y2);

        emit LogCommitment(uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender))), x3, y3);


        return (x3, y3, randomValue3);
    }


    /**
     * @dev Subtracts two commitments on the elliptic curve.
     * @param randomValue1 The random value associated with the first commitment.
     * @param x1 The x-coordinate of the first commitment.
     * @param y1 The y-coordinate of the first commitment.
     * @param randomValue2 The random value associated with the second commitment.
     * @param x2 The x-coordinate of the second commitment.
     * @param y2 The y-coordinate of the second commitment.
     * @return (x3, y3, randomValue3) The coordinates of the resulting commitment after subtraction,
     *         and the new random value corresponding to the result.
     *
     * @notice This function ensures that the subtraction operation is performed correctly under
     *         the elliptic curve arithmetic rules. The random values are adjusted using modulo
     *         to maintain the validity of the operations. If randomValue1 is less than randomValue2,
     *         it wraps around using the modular arithmetic.
     */
    function subCommitment(
        uint256 randomValue1,
        uint256 x1,
        uint256 y1,
        uint256 randomValue2,
        uint256 x2,
        uint256 y2
    ) public returns (uint256, uint256, uint256) {
        uint256 randomValue3;
        uint256 x3;
        uint256 y3;

        if (randomValue1 < randomValue2) {
            randomValue3 = mod - (randomValue2 - randomValue1);
        } else {
            randomValue3 = (randomValue1 - randomValue2) % mod;
        }

        (x3, y3) = ellipticSub(x1, y1, x2, y2);

        emit LogCommitment(uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender))), x3, y3);


        return (x3, y3, randomValue3);
    }
}
