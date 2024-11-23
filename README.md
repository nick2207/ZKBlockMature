# ZKBlockMature

A decentralized application (DApp) that utilizes **Zero-Knowledge Proofs (ZKP)** and **Pedersen Commitments** to authenticate and verify user data on the blockchain securely. This project focuses on combining cryptographic methods to ensure data privacy and validity while maintaining transparency through blockchain technology.

> **Disclaimer**: This project is part of a university assignment and should be considered a Proof of Concept (PoC) only. It is not suitable for production use and has known limitations.

---

## Features

- **Commitment Mechanism**: Uses Pedersen Commitments to securely encode sensitive data, such as a user's birthdate.
- **Zero-Knowledge Proofs**: Implements ZKP with the Groth16 proving system to verify properties of data (e.g., age verification) without revealing the data itself.
- **Elliptic Curve Cryptography**: Utilizes efficient operations based on Jacobian coordinates for optimized cryptographic calculations.
- **Integration Ready**: Designed to integrate with web applications using libraries like Snarkjs and tools like Angular.

---

## How It Works

### 1. **Content Authentication**:
   - Commit sensitive data (e.g., birthdate) to the blockchain using Pedersen Commitments.
   - Validate the commitment through an authorized entity, which records a transaction ID on a private blockchain.

### 2. **Integration**:
   - Users provide the transaction ID and random number for validation via the web application.
   - Verify the commitment and perform ZKP-based validation of specific properties.
   - Access to application features is granted based on proof validation.

---

## Technology Stack

- **Frontend**: Angular
- **Backend**: Node.js
- **Blockchain**: Solidity smart contracts on Ethereum-compatible blockchains
- **Cryptography**: Pedersen Commitment, Groth16 (ZKP), and ECC (Elliptic Curve Cryptography)

---

## Prerequisites

- Node.js >= 16.0
- Angular >= 15.0
- MetaMask or any compatible wallet for interacting with the blockchain
- Ethereum-compatible testnet or local blockchain (e.g., Ganache, Hardhat)

---
