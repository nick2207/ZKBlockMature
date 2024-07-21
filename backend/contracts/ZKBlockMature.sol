// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./EllipticCurve.sol";
import "./PedersenCommitment.sol";

contract ZKBlockMature is Ownable, EllipticCurve, PedersenCommitment {
    mapping(address => uint256) public commitments;

    event AgeVerified(address indexed user, bool isOldEnough);

    function commitAge(uint256 randomValue, uint256 age) public {
        uint256 x;
        uint256 y;
        (x, y) = commit(randomValue, age);
        commitments[msg.sender] = uint256(keccak256(abi.encodePacked(x, y)));
    }

    function verifyAge(uint256 randomValue, uint256 age) public {
        uint256 x;
        uint256 y;
        (x, y) = commit(randomValue, age);
        uint256 commitmentHash = uint256(keccak256(abi.encodePacked(x, y)));

        // Check if the commitment matches the stored commitment
        require(commitments[msg.sender] == commitmentHash, "Invalid commitment");

        // Emit the verification result
        bool isOldEnough = age >= 18;
        emit AgeVerified(msg.sender, isOldEnough);
    }
}
