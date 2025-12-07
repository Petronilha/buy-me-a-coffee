# ☕ Buy Me A Crypto Coffee

> Uma aplicação descentralizada (dApp) completa que permite aos usuários enviarem doações em ETH com mensagens personalizadas, armazenadas imutavelmente na Blockchain.

![Status do Projeto](https://img.shields.io/badge/Status-Concluído-brightgreen)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.27-363636)
![React](https://img.shields.io/badge/React-Vite-61DAFB)

## 📸 Preview do Projeto

![Interface da Aplicação](.//frontend/src/assets/tela-inicial.png)
---
![Interface da Aplicação](.//frontend/src/assets/transaction.png)
*Interface com design Glassmorphism, mostrando a conexão de carteira e a lista de apoiadores em tempo real.*

---

## 🚀 Sobre o Projeto

Este projeto foi desenvolvido para consolidar conhecimentos em **Web3** e **Desenvolvimento Blockchain**. A aplicação conecta um Front-end moderno em React a um Smart Contract escrito em Solidity.

**Funcionalidades Principais:**
* 🦊 **Conexão com Carteira:** Login via MetaMask.
* 💰 **Doações:** Envio de ETH através da rede Ethereum (Testnet/Localhost).
* 📝 **Memos On-Chain:** Apoiadores podem deixar nome e mensagem, gravados para sempre na blockchain.
* 🔄 **Atualização em Tempo Real:** A interface escuta eventos da blockchain (`emit NewMemo`) e atualiza a lista sem recarregar a página.
* 🛡️ **Saque Seguro:** Apenas o dono do contrato (owner) pode sacar os fundos acumulados.

---

## 🛠️ Tecnologias Utilizadas

* **Solidity:** Linguagem do Smart Contract.
* **Hardhat:** Ambiente de desenvolvimento, testes e deploy local.
* **Ethers.js (v6):** Biblioteca para interação Front-end <-> Blockchain.
* **React.js + Vite:** Framework para construção da interface.
* **CSS3:** Estilização com Glassmorphism.

---