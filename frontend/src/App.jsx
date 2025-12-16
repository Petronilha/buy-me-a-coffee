import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/BuyMeACoffee.json";
import "./App.css";

export default function App() {
	// 1. State Variables
	const [currentAccount, setCurrentAccount] = useState("");
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [memos, setMemos] = useState([]);

	// WARNING: Replace with the address found in your terminal after deploying
	const contractAddress = "0xbf6A78d1197F63C62e9E9e6978b64dA8AA6AA353";
	const contractABI = abi.abi;

	// 2. Connection Logic
	const checkWalletConnection = async () => {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				console.log("Please install MetaMask!");
				return;
			}

			const accounts = await ethereum.request({ method: "eth_accounts" });

			if (accounts.length > 0) {
				const account = accounts[0];
				console.log("Found account:", account);
				setCurrentAccount(account);
				// If already connected, fetch memos
				fetchMemos();
			} else {
				console.log("No account found");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const switchToAmoyNetwork = async () => {
		try {
			const { ethereum } = window;
			if (!ethereum) return;

			// Tries to switch to Amoy network (Chain ID 80002 in Hex is 0x13882)
			await ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: "0x13882" }],
			});
		} catch (error) {
			// If the network doesn't exist in user's MetaMask, add it
			if (error.code === 4902) {
				try {
					await window.ethereum.request({
						method: "wallet_addEthereumChain",
						params: [
							{
								chainId: "0x13882",
								chainName: "Polygon Amoy Testnet",
								rpcUrls: ["https://rpc-amoy.polygon.technology/"],
								nativeCurrency: {
									name: "POL",
									symbol: "POL",
									decimals: 18,
								},
								blockExplorerUrls: ["https://amoy.polygonscan.com/"],
							},
						],
					});
				} catch (addError) {
					console.error("Error adding network:", addError);
				}
			} else {
				console.error("Error switching network:", error);
			}
		}
	};

	const connectWallet = async () => {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				alert("Get MetaMask!");
				return;
			}

			await switchToAmoyNetwork();

			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});
			console.log("Connected", accounts[0]);
			setCurrentAccount(accounts[0]);
			fetchMemos();
		} catch (error) {
			console.log(error);
		}
	};

	const fetchMemos = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.BrowserProvider(ethereum);
				const buyMeACoffee = new ethers.Contract(
					contractAddress,
					contractABI,
					provider
				);

				console.log("Fetching memos...");
				const memos = await buyMeACoffee.getMemos();
				setMemos(memos);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const buyCoffee = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.BrowserProvider(ethereum);
				const signer = await provider.getSigner();
				const buyMeACoffee = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				console.log("Sending coffee...");
				setLoading(true);

				// Arguments must match Solidity order: buyCoffee(_name, _message)
				const coffeeTxn = await buyMeACoffee.buyCoffee(
					name ? name : "Anonymous",
					message ? message : "Enjoy your coffee!",
					{ value: ethers.parseEther("0.001") }
				);

				await coffeeTxn.wait();

				setLoading(false);
				console.log("Mined!", coffeeTxn.hash);
				alert("Thanks for the coffee!");

				// Clear fields and refresh list
				setName("");
				setMessage("");
				fetchMemos();
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	// 3. Effects (Runs on load)
	useEffect(() => {
		checkWalletConnection; // Fixed: Added parenthesis to execute function

		// Setup a listener to update the screen automatically when a new coffee arrives
		let buyMeACoffee;
		const onNewMemo = (from, timestamp, name, message) => {
			console.log("New memo received!", from, timestamp, name, message);
			setMemos((prevState) => [
				...prevState,
				{
					address: from,
					timestamp: new Date(Number(timestamp) * 1000),
					name,
					message,
				},
			]);
		};

		const { ethereum } = window;
		if (ethereum) {
			const provider = new ethers.BrowserProvider(ethereum);
			buyMeACoffee = new ethers.Contract(
				contractAddress,
				contractABI,
				provider
			);
			// Listen to the "NewMemo" event from the contract
			buyMeACoffee.on("NewMemo", onNewMemo);
		}

		// Cleanup listener when leaving the page
		return () => {
			if (buyMeACoffee) {
				buyMeACoffee.off("NewMemo", onNewMemo);
			}
		};
	}, []); // Fixed: Added dependency array to run only once

	// 4. Layout (JSX)
	return (
		<div className="mainContainer">
			<div className="dataContainer">
				<div className="header">☕ Buy Me a Coffee</div>

				<div className="bio">
					Hi, I am <strong>Daniel Petronilha</strong>. I'm building
					decentralized dApps. Consider supporting me with test POL!
				</div>

				{!currentAccount && (
					<button className="connectButton" onClick={connectWallet}>
						🦊 Connect Wallet
					</button>
				)}

				{currentAccount && (
					<div className="form-area">
						<div className="form-group">
							<input
								id="name"
								type="text"
								placeholder="Your Name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<textarea
								rows={3}
								placeholder="Leave a message..."
								id="message"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
							/>
						</div>

						<button
							className="coffeeButton"
							onClick={buyCoffee}
							disabled={loading}
						>
							{loading ? "Sending..." : "Send 1 Coffee (0.001 POL)"}
						</button>
					</div>
				)}

				{currentAccount && (
					<div className="memos-list">
						<h3>Latest Supporters:</h3>
						{memos.map((memo, idx) => {
							return (
								<div key={idx} className="memo-card">
									<div className="memo-header">
										<span style={{ fontWeight: "bold" }}>{memo.name}</span>
										<span>
											{new Date(
												Number(memo.timestamp) * 1000
											).toLocaleDateString()}
										</span>
									</div>
									<p>"{memo.message}"</p>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
