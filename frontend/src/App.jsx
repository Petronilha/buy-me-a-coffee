import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/BuyMeACoffee.json";
import "./App.css";

export default function App() {
	const [contaAtual, setContaAtual] = useState("");
	const [nome, setNome] = useState("");
	const [mensagem, setMensagem] = useState("");
	const [loading, setLoading] = useState(false);

	// Memos fuctícios só para visualizar o layout
	const [memos] = useState([
		{
			nome: "Ana",
			mensagem: "Ótimo trabalho!",
			timestamp: new Date().getTime(),
		},
		{
			nome: "Carlos",
			mensagem: "Web3 é o futuro.",
			timestamp: new Date().getTime(),
		},
	]);

	const enderecoContrato = "0xSEU_ENDERECO_AQUI";
	const contractABI = abi.abi;

	const verificarCarteiraConectada = async () => {
		const { ethereum } = window;
		if (!ethereum) return;
		const contas = await ethereum.request({ method: "eth_requrestAccounts" });
		setContaAtual(contas[0]);
	};

	const comprarCafe = async () => {
		if (!nome || !mensagem) return alert("Preencha os campos!");

		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.BrowserProvider(ethereum);
				const signer = await provider.getSigner();
				const buyMeACoffee = new ethers.Contract(
					enderecoContrato,
					contractABI,
					signer
				);

				setLoading(true);
				console.log("Pagando o café...");
				// Assumindo valor 0.001 ETH
				const txn = await buyMeACoffee.buyCoffee(nome, mensagem, {
					value: ethers.parseEther("0.001"),
				});

				await txn.wait();
				setLoading(false);
				console.log("Minerado!", txn.hash);
				alert("Café enviado! Obrigado.");

				// Aqui depois vamos limpar os campos
				setNome("");
				setMensagem("");
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		//verificarCarteiraConectada();
	}, []);

	return (
		<div className="mainContainer">
			<div className="dataContainer">
				<div className="header">☕ Buy Me a Coffee</div>
				<div className="bio">
					Olá, sou o <strong>Daniel Petronilha</strong>. Estou construindo dApps
					descentralizadas. Se você gostou do meu trabalho, considere me apoiar
					com Ethereum de teste!
				</div>
				{/* Botão de Conectar (Só aparece se não estiver conectado*/}
				{!contaAtual && (
					<button className="connectButton" /*onClick={nectarCarteira}*/>
						🦊 Conectar MetaMask
					</button>
				)}
				{/* Formulário de Envio */}
				{contaAtual && (
					<div className="form-area">
						<div className="form-group">
							<input
								id="name"
								type="text"
								placeholder="Seu Nome"
								value={nome}
								onChange={(e) => setNome(e.target.value)}
							/>
							<textarea
								rows={3}
								placeholder="Deixe uma mensagem..."
								id="message"
								value={mensagem}
								onChange={(e) => setMensagem(e.target.value)}
							/>
						</div>
						<button
							className="coffeeButton"
							onClick={comprarCafe}
							disabled={loading}
						>
							{loading
								? "Enviando transaction..."
								: "Enviar 1 Café (0.001 ETH)"}
						</button>
					</div>
				)}
				{/* Lista de Recentes (Memos) */}
				contaAtual && (
				<div className="memos-list">
					<h3>Últimos apoiadores:</h3>
					{memos.map((memo, idx) => {
						return (
							<div key={idx} className="memo-card">
								<div className="memo-header">
									<span style={{ fontWeight: "bold" }}>{memo.nome}</span>
									<span>{new Date(memo.timestamp).toLocaleDateString()}</span>
								</div>
								<p>"{memo.mensagem}"</p>
							</div>
						);
					})}
				</div>
				)
			</div>
		</div>
	);
}
