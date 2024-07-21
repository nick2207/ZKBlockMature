// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.21;

import "./verifier.sol";

contract AgeVerifier is Groth16Verifier{
  event proved(address indexed _from, uint output, bool proved);

  constructor() {}

  function doProof(
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[1] calldata input
    ) public {
        emit proved(msg.sender, input[0], verifyProof(a, b, c, input) );
    }
}