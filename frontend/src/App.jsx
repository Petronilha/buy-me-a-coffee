import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/BuyMeACoffee.json";
import "./App.css";

export default function App() {
	// 1. Estados (Variáveis)
	const [contaAtual, setContaAtual] = useState("");
	const [nome, setNome] = useState("");
	const [mensagem, setMensagem] = useState("");
	const [loading, setLoading] = useState(false);
	const [memos, setMemos] = useState([]);

	// ATENÇÃO: Troque pelo endereço que apareceu no seu terminal quando fez o deploy localhost
	const enderecoContrato = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
	const contractABI = abi.abi;

	// 2. Lógica de Conexão (Aqui estava faltando!)
	const verificarCarteiraConectada = async () => {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				console.log("Instale a MetaMask!");
				return;
			}

			const contas = await ethereum.request({ method: "eth_accounts" });

			if (contas.length > 0) {
				const conta = contas[0];
				console.log("Encontramos a conta:", conta);
				setContaAtual(conta);
				// Se já estiver conectado, busca os recados
				buscarMemos();
			} else {
				console.log("Nenhuma conta encontrada");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const conectarCarteira = async () => {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				alert("Baixe a MetaMask!");
				return;
			}

			const contas = await ethereum.request({ method: "eth_requestAccounts" });
			console.log("Conectado", contas[0]);
			setContaAtual(contas[0]);
			buscarMemos();
		} catch (error) {
			console.log(error);
		}
	};

	const buscarMemos = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.BrowserProvider(ethereum);
				const buyMeACoffee = new ethers.Contract(
					enderecoContrato,
					contractABI,
					provider
				);

				console.log("Buscando recados...");
				const memos = await buyMeACoffee.getMemos();
				setMemos(memos);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const comprarCafe = async () => {
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

				console.log("Enviando café...");
				setLoading(true);

				const cafeTxn = await buyMeACoffee.buyCoffee(
					nome ? nome : "Anônimo",
					mensagem ? mensagem : "Aproveite o café!",
					{ value: ethers.parseEther("0.001") }
				);

				await cafeTxn.wait();

				setLoading(false);
				console.log("Minerado!", cafeTxn.hash);
				alert("Obrigado pelo café!");

				// Limpa os campos e atualiza a lista
				setNome("");
				setMensagem("");
				buscarMemos();
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	// 3. Efeitos (Roda ao iniciar)
	useEffect(() => {
		verificarCarteiraConectada;

		// Configura um "listener" para atualizar a tela sozinho quando chegar um café novo
		let buyMeACoffee;
		const onNewMemo = (from, timestamp, name, message) => {
			console.log("Novo recado recebido!", from, timestamp, name, message);
			setMemos((prevState) => [
				...prevState,
				{
					address: from,
					timestamp: new Date(Number(timestamp) * 1000),
					message,
					name,
				},
			]);
		};

		const { ethereum } = window;
		if (ethereum) {
			const provider = new ethers.BrowserProvider(ethereum);
			buyMeACoffee = new ethers.Contract(
				enderecoContrato,
				contractABI,
				provider
			);
			// Escuta o evento "NewMemo" do contrato
			buyMeACoffee.on("NewMemo", onNewMemo);
		}

		// Limpeza do listener quando sai da página
		return () => {
			if (buyMeACoffee) {
				buyMeACoffee.off("NewMemo", onNewMemo);
			}
		};
	});

	// 4. Layout (JSX)
	return (
		<div className="mainContainer">
			<div className="dataContainer">
				<div className="header">☕ Buy Me a Coffee</div>

				<div className="bio">
					Olá, sou o <strong>Daniel Petronilha</strong>. Estou construindo dApps
					descentralizadas. Considere me apoiar com ETH de teste!
				</div>

				{!contaAtual && (
					<button className="connectButton" onClick={conectarCarteira}>
						🦊 Conectar Carteira
					</button>
				)}

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
							{loading ? "Enviando..." : "Enviar 1 Café (0.001 ETH)"}
						</button>
					</div>
				)}

				{contaAtual && (
					<div className="memos-list">
						<h3>Últimos apoiadores:</h3>
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
