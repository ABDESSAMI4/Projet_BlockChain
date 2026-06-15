export const GANACHE_NETWORK_IDS = ["1337", "5777"];
export const MAINNET_IDS = ["1"];

export const toDecimalChainId = (chainId) => {
  if (!chainId) return "";
  const value = String(chainId);
  return value.startsWith("0x") ? String(parseInt(value, 16)) : value;
};

export const isMainnet = (networkId, chainId) =>
  MAINNET_IDS.includes(String(networkId || "")) ||
  MAINNET_IDS.includes(toDecimalChainId(chainId));

export const isGanacheNetwork = (networkId, chainId) =>
  GANACHE_NETWORK_IDS.includes(String(networkId || "")) ||
  GANACHE_NETWORK_IDS.includes(toDecimalChainId(chainId));

export const getNetworkLabel = (networkId, chainId) => {
  if (isMainnet(networkId, chainId)) return "Ethereum Mainnet";
  if (isGanacheNetwork(networkId, chainId)) return "Ganache";
  if (networkId) return `Reseau ${networkId}`;
  if (chainId) return `Chain ${toDecimalChainId(chainId)}`;
  return "Non detecte";
};

export const hasRuntimeCode = (code) =>
  Boolean(code && code !== "0x" && code !== "0x0");

export const getKnownDeploymentIds = (contractJson) =>
  Object.keys(contractJson?.networks || {});

export async function createContractInstance(web3, contractJson) {
  if (!web3) {
    throw new Error("Web3 n'est pas initialise. Connecte MetaMask.");
  }

  // Truffle enregistre les deploiements par networkId.
  const networkId = await web3.eth.net.getId();
  const networkKey = String(networkId);
  const deployedNetwork = contractJson.networks?.[networkKey];

  if (!deployedNetwork?.address) {
    const knownIds = getKnownDeploymentIds(contractJson);
    const knownText = knownIds.length ? knownIds.join(", ") : "aucun";
    throw new Error(
      `Contract has not been deployed to detected network ${networkKey}. Reseaux deployes: ${knownText}.`
    );
  }

  const code = await web3.eth.getCode(deployedNetwork.address);

  if (!hasRuntimeCode(code)) {
    throw new Error(
      `Aucun contrat trouve a cette adresse sur le reseau detecte: ${deployedNetwork.address}. Relance truffle migrate --reset.`
    );
  }

  return {
    address: deployedNetwork.address,
    instance: new web3.eth.Contract(contractJson.abi, deployedNetwork.address),
    networkId: networkKey,
  };
}

export const normalizeReceipt = (receipt) => {
  const status = String(receipt?.status);
  const isSuccess = receipt?.status === true || status === "1" || status === "true";

  return {
    hash: receipt?.transactionHash || "",
    gasUsed: receipt?.gasUsed ? String(receipt.gasUsed) : "Non disponible",
    status: isSuccess ? "Succes" : "Confirmee",
  };
};

export const shortenAddress = (address) => {
  if (!address) return "Non connecte";
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
};
