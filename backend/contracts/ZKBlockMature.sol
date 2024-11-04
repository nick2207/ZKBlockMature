//  SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.21;

// import "./Groth16Verifier.sol";
import "./AgeVerifier.sol";
import "../node_modules/hardhat/console.sol";

interface IGroth16Verifier {

    function verifyProof(
        uint[2] memory _pA, 
        uint[2][2] memory _pB, 
        uint[2] memory _pC, 
        uint[1] memory _pubSignals
    ) external view returns (bool);
}


contract ZKBlockMature {

    address public s_grothVerifierAddress;

    event ProofVerification(bool result);

    constructor(address grothVerifierAddress) {
        s_grothVerifierAddress = grothVerifierAddress;
    }

    /**
     * @dev Submits a proof for verification.
     * @notice This function calls the verifyProof function of the Groth16 verifier contract.
     * Emits a ProofVerification event with the result of the verification.
     * Reverts if the proof is invalid.
     */
    function submitProof(uint[2] memory _pA, 
        uint[2][2] memory _pB, 
        uint[2] memory _pC, 
        uint[1] memory _pubSignals) public  returns (bool) {
        bool result = IGroth16Verifier(s_grothVerifierAddress).verifyProof(_pA, _pB, _pC, _pubSignals);
        emit ProofVerification(result);
        require(result, "Invalid Proof");
        return true;
    }
}
