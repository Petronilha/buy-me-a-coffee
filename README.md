# ☕ Buy Me A Crypto Coffee

> A complete decentralized application (dApp) that allows users to send donations in POL (Polygon) with personalized messages, stored immutably on the Blockchain.

![Project Status](https://img.shields.io/badge/Status-Completed-brightgreen)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.27-363636)
![React](https://img.shields.io/badge/React-Vite-61DAFB)
![Network](https://img.shields.io/badge/Network-Polygon_Amoy-8247E5)

## 📸 Project Preview

![App Interface](.//frontend/src/assets/tela-inicial.png)
---
![App Interface](.//frontend/src/assets/transaction.png)
*Glassmorphism design interface, showing wallet connection and real-time supporter list.*

---

## 🚀 About the Project

This project was developed to consolidate **Web3** and **Blockchain Development** knowledge. The application connects a modern Front-end in React to a Smart Contract written in Solidity, deployed on the **Polygon Amoy Testnet**.

**Key Features:**
* 🦊 **Wallet Connection:** Login via MetaMask with automatic network switching to Polygon Amoy.
* 💰 **Donations:** Send **POL** (formerly MATIC) through the Polygon network.
* 📝 **On-Chain Memos:** Supporters can leave a name and message, recorded forever on the blockchain.
* 🔄 **Real-Time Updates:** The interface listens for blockchain events (`emit NewMemo`) and updates the list without reloading the page.
* 🛡️ **Secure Withdrawal:** Only the contract owner can withdraw the accumulated funds.

---

## 🛠️ Technologies Used

* **Solidity:** Smart Contract language.
* **Hardhat:** Environment for development, testing, and deployment (configured for Amoy).
* **Ethers.js (v6):** Library for Front-end <-> Blockchain interaction.
* **React.js + Vite:** Framework for building the interface.
* **CSS3:** Styling with Glassmorphism.

---

## 🔗 Contract Details

* **Network:** Polygon Amoy Testnet (Chain ID: 80002)
* **Currency:** POL
* **Contract Address:** `0xbf6A78d1197F63C62e9E9e6978b64dA8AA6AA353`