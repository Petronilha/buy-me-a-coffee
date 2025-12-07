const hre = require("hardhat");

async function main() {
	const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");

	const buymeACoffee = await BuyMeACoffee.deploy();

	await buymeACoffee.waitForDeployment();

	const address = await buymeACoffee.getAddress();

	console.log("BuyMeACoffee implantado em:", address);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
