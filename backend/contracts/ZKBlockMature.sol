// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.21;

import "./Verifier.sol";

interface AgeVerifier {
        function verifyProof(bytes memory proof, uint[] memory pubSignals) external view returns (bool);
    }
    
contract ZKBlockMature is Groth16Verifier{

    address public ageVerifierAddress;
    // event proved(address indexed _from, uint output, bool proved);
    event ProofVerification(bool result);

    constructor(address _ageVerifierAddress) {
        ageVerifierAddress = _ageVerifierAddress;
    }

    function verifyProof(bytes memory proof, uint[] memory pubSignals) public {
        bool result = AgeVerifier(ageVerifierAddress).verifyProof(proof, pubSignals);
        emit ProofVerification(result);
    }
}