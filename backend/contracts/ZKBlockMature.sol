

// // SPDX-License-Identifier: GPL-3.0
// pragma solidity ^0.8.21;

// import "./Groth16Verifier.sol";
// import "../node_modules/hardhat/console.sol";

// contract ZKBlockMature {

//     Groth16Verifier public groth16Verifier;

//     event ProofVerification(bool result);
//     event DebugLog(string message, bool value); 

//     constructor(address _groth16VerifierAddress) {
//         groth16Verifier = Groth16Verifier(_groth16VerifierAddress);
//     }

//     function verifyProof(
//         uint[2] memory _pA, 
//         uint[2][2] memory _pB, 
//         uint[2] memory _pC, 
//         uint[1] memory _pubSignals
//     ) public {
//         emit DebugLog("Before calling verifier", false);
//         bool result = groth16Verifier.verifyProof(_pA, _pB, _pC, _pubSignals);
//         emit DebugLog("After calling verifier", result); // Emit event with result
//         emit ProofVerification(result);
//     }
// }


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
