import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Web3 } from "web3";
import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import ExercisePage from "./pages/ExercisePage";
import {
  getNetworkLabel,
  isGanacheNetwork,
  isMainnet,
  toDecimalChainId,
} from "./utils/contracts";

const GANACHE_CHAINS = [
  {
    chainId: "0x539",
    chainName: "Ganache 1337",
  },
  {
    chainId: "0x1691",
    chainName: "Ganache 5777",
  },
];

function getEthereumProvider() {
  return typeof window !== "undefined" ? window.ethereum : undefined;
}

function getReadableError(error) {
  const message = error?.message || String(error);

  if (message.toLowerCase().includes("failed to fetch")) {
    return "Ganache ne repond pas sur 127.0.0.1:7545. Lance Ganache GUI puis reconnecte MetaMask.";
  }

  if (message.toLowerCase().includes("user rejected")) {
    return "Connexion refusee dans MetaMask.";
  }

  return message;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [networkId, setNetworkId] = useState("");
  const [chainId, setChainId] = useState("");
  const [latestBlock, setLatestBlock] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const [isSupportedNetwork, setIsSupportedNetwork] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  const loadBlockchainState = useCallback(async (instance) => {
    const ethereum = getEthereumProvider();

    if (!ethereum) {
      setConnectionError("MetaMask est absent. Installe MetaMask pour utiliser les contrats.");
      setIsSupportedNetwork(false);
      return;
    }

    try {
      // On lit les comptes sans ouvrir MetaMask automatiquement.
      const [accounts, detectedNetworkId, detectedChainId, blockNumber] =
        await Promise.all([
          ethereum.request({ method: "eth_accounts" }),
          instance.eth.net.getId(),
          ethereum.request({ method: "eth_chainId" }),
          instance.eth.getBlockNumber(),
        ]);

      const normalizedNetworkId = String(detectedNetworkId);
      const normalizedChainId = toDecimalChainId(detectedChainId);
      const onMainnet = isMainnet(normalizedNetworkId, normalizedChainId);
      const onGanache = isGanacheNetwork(normalizedNetworkId, normalizedChainId);

      setAccount(accounts?.[0] || "");
      setNetworkId(normalizedNetworkId);
      setChainId(normalizedChainId);
      setLatestBlock(String(blockNumber));
      setIsSupportedNetwork(onGanache && !onMainnet);

      if (onMainnet) {
        setConnectionError(
          "Ethereum Mainnet est bloque pour ce projet. Selectionne Ganache dans MetaMask."
        );
      } else if (!onGanache) {
        setConnectionError(
          `Mauvais reseau: ${getNetworkLabel(normalizedNetworkId, normalizedChainId)}. Utilise Ganache chain id 1337 ou 5777.`
        );
      } else {
        setConnectionError("");
      }
    } catch (error) {
      setIsSupportedNetwork(false);
      setConnectionError(getReadableError(error));
    }
  }, []);

  const refreshBlockchain = useCallback(async () => {
    if (!web3) return;
    await loadBlockchainState(web3);
  }, [loadBlockchainState, web3]);

  const connectWallet = useCallback(async () => {
    const ethereum = getEthereumProvider();

    if (!ethereum) {
      setConnectionError("MetaMask est absent. Installe MetaMask puis recharge la page.");
      return;
    }

    try {
      const instance = web3 || new Web3(ethereum);
      setWeb3(instance);

      // Cette ligne ouvre MetaMask et recupere le compte choisi.
      await ethereum.request({ method: "eth_requestAccounts" });
      await loadBlockchainState(instance);
    } catch (error) {
      setConnectionError(getReadableError(error));
    }
  }, [loadBlockchainState, web3]);

  const switchToGanache = useCallback(async () => {
    const ethereum = getEthereumProvider();

    if (!ethereum) {
      setConnectionError("MetaMask est absent. Impossible de changer de reseau.");
      return;
    }

    const rpcUrls = ["http://127.0.0.1:7545"];
    const nativeCurrency = { name: "Ether", symbol: "ETH", decimals: 18 };

    for (const chain of GANACHE_CHAINS) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chain.chainId }],
        });
        return;
      } catch (switchError) {
        if (switchError?.code !== 4902) continue;

        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{ ...chain, rpcUrls, nativeCurrency }],
          });
          return;
        } catch (addError) {
          setConnectionError(getReadableError(addError));
        }
      }
    }

    setConnectionError(
      "Ajoute Ganache dans MetaMask avec RPC http://127.0.0.1:7545 et chain id 1337 ou 5777."
    );
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const ethereum = getEthereumProvider();

    if (!ethereum) {
      setConnectionError("MetaMask est absent. L'interface reste consultable.");
      return;
    }

    const instance = new Web3(ethereum);
    setWeb3(instance);
    loadBlockchainState(instance);
  }, [loadBlockchainState]);

  useEffect(() => {
    const ethereum = getEthereumProvider();
    if (!ethereum) return undefined;

    const handleAccountsChanged = () => {
      if (web3) loadBlockchainState(web3);
    };

    const handleChainChanged = () => {
      const instance = new Web3(ethereum);
      setWeb3(instance);
      loadBlockchainState(instance);
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [loadBlockchainState, web3]);

  useEffect(() => {
    if (!web3) return undefined;
    const interval = window.setInterval(() => loadBlockchainState(web3), 12000);
    return () => window.clearInterval(interval);
  }, [loadBlockchainState, web3]);

  const blockchain = useMemo(
    () => ({
      account,
      chainId,
      connectionError,
      connectWallet,
      isSupportedNetwork,
      latestBlock,
      networkId,
      networkName: getNetworkLabel(networkId, chainId),
      refreshBlockchain,
      switchToGanache,
      web3,
    }),
    [
      account,
      chainId,
      connectionError,
      connectWallet,
      isSupportedNetwork,
      latestBlock,
      networkId,
      refreshBlockchain,
      switchToGanache,
      web3,
    ]
  );

  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <ScrollToTop />
      <div className="app-shell">
        <Sidebar />
        <div className="main-shell">
          <Navbar
            account={account}
            latestBlock={latestBlock}
            networkName={blockchain.networkName}
            theme={theme}
            connectionError={connectionError}
            isSupportedNetwork={isSupportedNetwork}
            onConnect={connectWallet}
            onSwitchNetwork={switchToGanache}
            onToggleTheme={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
          />

          <main className="content-area">
            <Routes>
              <Route path="/" element={<Home blockchain={blockchain} />} />
              <Route path="/exercises/:id" element={<ExercisePage blockchain={blockchain} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
