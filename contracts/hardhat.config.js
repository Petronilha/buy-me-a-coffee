require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.28",
	networks: {
		// Rede Local (padrão)
		localhost: {
			url: "http://127.0.0.1:8545/",
			chainId: 31337,
		},
		// Nova Rede Amoy
		amoy: {
			url: process.env.AMOY_RPC_URL,
			accounts: [process.env.PRIVATE_KEY],
			chainId: 80002, // ID oficial da Amoy
		},
	},
};
