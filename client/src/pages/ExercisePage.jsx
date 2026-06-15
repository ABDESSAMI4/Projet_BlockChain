import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import BlockchainInfo from "../components/BlockchainInfo";
import { exercises, getExercise } from "../data/exercises";
import {
  createContractInstance,
  getKnownDeploymentIds,
  normalizeReceipt,
} from "../utils/contracts";

const emptyReceipt = {
  hash: "",
  gasUsed: "",
  status: "",
};

const buildInitialValues = (exercise) => {
  const values = {};
  const actions = [...(exercise.readActions || []), ...(exercise.writeActions || [])];

  actions.forEach((action) => {
    values[action.id] = {};

    (action.inputs || []).forEach((input) => {
      values[action.id][input.name] = input.defaultValue || "";
    });

    if (action.valueInput) {
      values[action.id][action.valueInput.name] = action.valueInput.defaultValue || "";
    }
  });

  return values;
};

const formatValue = (value, action, web3) => {
  if (Array.isArray(value)) {
    return `[${value.map((item) => formatValue(item, {}, web3)).join(", ")}]`;
  }

  if (typeof value === "bigint") {
    const text = value.toString();
    return action?.format === "ether" ? `${web3.utils.fromWei(text, "ether")} ETH` : text;
  }

  if (typeof value === "boolean") {
    return value ? "Oui" : "Non";
  }

  if (action?.format === "ether") {
    return `${web3.utils.fromWei(String(value), "ether")} ETH`;
  }

  return value === undefined || value === null ? "" : String(value);
};

function ActionCard({
  action,
  busy,
  disabled,
  mode,
  onInputChange,
  onSubmit,
  result,
  values,
}) {
  const fields = action.inputs || [];
  const submitLabel = mode === "write" ? "Envoyer la transaction" : "Lire";

  return (
    <form className="function-card action-card" onSubmit={(event) => onSubmit(event, action)}>
      <div>
        <p className="eyebrow">{mode === "write" ? "Transaction" : "Lecture"}</p>
        <h3>{action.label}</h3>
      </div>

      {fields.map((input) => (
        <label className="field-label" key={input.name}>
          {input.label}
          <input
            className="text-input"
            min={input.min}
            step={input.step}
            type={input.type || "text"}
            value={values?.[input.name] || ""}
            onChange={(event) => onInputChange(action.id, input.name, event.target.value)}
            required
          />
        </label>
      ))}

      {action.valueInput ? (
        <label className="field-label">
          {action.valueInput.label}
          <input
            className="text-input"
            min={action.valueInput.min}
            step={action.valueInput.step}
            type={action.valueInput.type || "number"}
            value={values?.[action.valueInput.name] || ""}
            onChange={(event) =>
              onInputChange(action.id, action.valueInput.name, event.target.value)
            }
            required
          />
        </label>
      ) : null}

      <button
        type="submit"
        className={mode === "write" ? "primary-button" : "secondary-button"}
        disabled={disabled || Boolean(busy)}
      >
        {busy ? "En cours..." : submitLabel}
      </button>

      <div className="mini-result">{result || "Resultat en attente"}</div>
    </form>
  );
}

function ExercisePage({ blockchain }) {
  const { id } = useParams();
  const exercise = getExercise(id);
  const activeExercise = exercise || exercises[0];

  const {
    account,
    chainId,
    isSupportedNetwork,
    latestBlock,
    networkId,
    networkName,
    refreshBlockchain,
    web3,
  } = blockchain;

  const [contractState, setContractState] = useState({
    address: "",
    contract: null,
    error: "",
    loading: false,
    networkId: "",
  });
  const [values, setValues] = useState(() => buildInitialValues(activeExercise));
  const [results, setResults] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [busyAction, setBusyAction] = useState("");
  const [lastTransaction, setLastTransaction] = useState(emptyReceipt);

  const deploymentIds = useMemo(
    () => getKnownDeploymentIds(activeExercise.artifact),
    [activeExercise]
  );

  const contractAvailable = Boolean(contractState.contract && !contractState.error);

  const getActionArgs = useCallback(
    (action) => (action.inputs || []).map((input) => values[action.id]?.[input.name] || ""),
    [values]
  );

  const readContractValue = useCallback(
    async (action, contract) => {
      if (!contract?.methods?.[action.method]) {
        throw new Error(`La methode ${action.method} est absente de l'ABI.`);
      }

      const args = getActionArgs(action);
      const callOptions = account ? { from: account } : {};
      const value = await contract.methods[action.method](...args).call(callOptions);

      return formatValue(value, action, web3);
    },
    [account, getActionArgs, web3]
  );

  const refreshAutoReads = useCallback(
    async (contract) => {
      if (!contract) return;

      const nextResults = {};
      const autoReads = (activeExercise.readActions || []).filter((action) => action.autoLoad);

      for (const action of autoReads) {
        nextResults[action.id] = await readContractValue(action, contract);
      }

      setResults((current) => ({ ...current, ...nextResults }));
    },
    [activeExercise.readActions, readContractValue]
  );

  useEffect(() => {
    setValues(buildInitialValues(activeExercise));
    setResults({});
    setFeedback(null);
    setLastTransaction(emptyReceipt);
  }, [activeExercise]);

  useEffect(() => {
    let isActive = true;

    const loadContract = async () => {
      if (!web3) {
        setContractState({
          address: "",
          contract: null,
          error: "MetaMask est absent ou non initialise. Clique sur Connect Wallet.",
          loading: false,
          networkId: "",
        });
        return;
      }

      if (!isSupportedNetwork) {
        setContractState({
          address: "",
          contract: null,
          error: "Mauvais reseau. Selectionne Ganache chain id 1337 ou 5777 dans MetaMask.",
          loading: false,
          networkId: "",
        });
        return;
      }

      setContractState((current) => ({ ...current, error: "", loading: true }));

      try {
        const loaded = await createContractInstance(web3, activeExercise.artifact);
        if (!isActive) return;

        setContractState({
          address: loaded.address,
          contract: loaded.instance,
          error: "",
          loading: false,
          networkId: loaded.networkId,
        });
      } catch (error) {
        if (!isActive) return;
        setContractState({
          address: "",
          contract: null,
          error: error.message,
          loading: false,
          networkId: "",
        });
      }
    };

    loadContract();

    return () => {
      isActive = false;
    };
  }, [activeExercise, isSupportedNetwork, networkId, web3]);

  useEffect(() => {
    if (!contractState.contract || contractState.error) return;

    refreshAutoReads(contractState.contract).catch((error) => {
      setFeedback({ type: "error", text: error.message });
    });
  }, [activeExercise.id, contractState.contract, contractState.error, refreshAutoReads]);

  const updateInput = (actionId, inputName, value) => {
    setValues((current) => ({
      ...current,
      [actionId]: {
        ...(current[actionId] || {}),
        [inputName]: value,
      },
    }));
  };

  const handleRead = async (event, action) => {
    event.preventDefault();

    if (!contractAvailable) {
      setFeedback({ type: "error", text: contractState.error || "Contrat indisponible." });
      return;
    }

    setBusyAction(action.id);
    setFeedback(null);

    try {
      const value = await readContractValue(action, contractState.contract);
      setResults((current) => ({ ...current, [action.id]: value }));
      setFeedback({ type: "success", text: "Lecture effectuee depuis le contrat." });
    } catch (error) {
      setFeedback({ type: "error", text: error.message });
    } finally {
      setBusyAction("");
    }
  };

  const handleWrite = async (event, action) => {
    event.preventDefault();

    if (!contractAvailable) {
      setFeedback({ type: "error", text: contractState.error || "Contrat indisponible." });
      return;
    }

    if (!account) {
      setFeedback({ type: "error", text: "Connecte MetaMask avant d'envoyer une transaction." });
      return;
    }

    if (!contractState.contract?.methods?.[action.method]) {
      setFeedback({ type: "error", text: `La methode ${action.method} est absente de l'ABI.` });
      return;
    }

    setBusyAction(action.id);
    setFeedback(null);

    try {
      const args = getActionArgs(action);
      const txOptions = { from: account };

      if (action.payable) {
        const ethValue = values[action.id]?.[action.valueInput.name] || "0";
        txOptions.value = web3.utils.toWei(ethValue, "ether");
      }

      // MetaMask demandera une confirmation pour cette transaction.
      const receipt = await contractState.contract.methods[action.method](...args).send(txOptions);
      setLastTransaction(normalizeReceipt(receipt));
      await refreshBlockchain?.();
      await refreshAutoReads(contractState.contract);
      setFeedback({ type: "success", text: "Transaction confirmee sur Ganache." });
    } catch (error) {
      setFeedback({ type: "error", text: error.message });
    } finally {
      setBusyAction("");
    }
  };

  if (!exercise) {
    return <Navigate to="/" replace />;
  }

  return (
    <motion.div
      className="page-stack"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <section className="page-header">
        <div>
          <p className="eyebrow">Exercice {exercise.id}</p>
          <h2>{exercise.title}</h2>
          <p>{exercise.summary}</p>
        </div>
        <Link to="/" className="secondary-button">
          Retour au sommaire
        </Link>
      </section>

      {contractState.loading ? (
        <div className="alert alert-warning" role="status">
          Chargement du contrat {exercise.contractName}...
        </div>
      ) : null}

      {contractState.error ? (
        <div className="alert alert-error" role="alert">
          {contractState.error} Deploiements connus: {deploymentIds.join(", ") || "aucun"}.
        </div>
      ) : null}

      {feedback ? (
        <div className={`alert alert-${feedback.type}`} role="status">
          {feedback.text}
        </div>
      ) : null}

      <BlockchainInfo
        account={account}
        chainId={chainId}
        latestBlock={latestBlock}
        networkId={networkId}
        networkName={networkName}
        contractAddress={contractState.address}
        contractName={exercise.contractName}
        onRefresh={refreshBlockchain}
      />

      <section className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Fonctions read / view / pure</p>
            <h2>Lectures du contrat</h2>
          </div>
        </div>

        <div className="function-grid">
          {(exercise.readActions || []).map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              busy={busyAction === action.id}
              disabled={!contractAvailable}
              mode="read"
              onInputChange={updateInput}
              onSubmit={handleRead}
              result={results[action.id]}
              values={values[action.id]}
            />
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Transactions</p>
            <h2>Ecritures blockchain</h2>
          </div>
        </div>

        {exercise.writeActions?.length ? (
          <div className="function-grid">
            {exercise.writeActions.map((action) => (
              <ActionCard
                key={action.id}
                action={action}
                busy={busyAction === action.id}
                disabled={!contractAvailable}
                mode="write"
                onInputChange={updateInput}
                onSubmit={handleWrite}
                result={
                  lastTransaction.hash && busyAction !== action.id
                    ? `Derniere transaction: ${lastTransaction.hash}`
                    : ""
                }
                values={values[action.id]}
              />
            ))}
          </div>
        ) : (
          <div className="mini-result">Cet exercice ne modifie pas l'etat du contrat.</div>
        )}
      </section>

      <section className="glass-card transaction-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Receipt</p>
            <h2>Derniere transaction</h2>
          </div>
        </div>

        <div className="info-grid compact">
          <div className="info-item">
            <span>Hash</span>
            <strong>{lastTransaction.hash || "Aucune transaction envoyee"}</strong>
          </div>
          <div className="info-item">
            <span>Gas utilise</span>
            <strong>{lastTransaction.gasUsed || "-"}</strong>
          </div>
          <div className="info-item">
            <span>Status</span>
            <strong className="accent-text">{lastTransaction.status || "-"}</strong>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default ExercisePage;
