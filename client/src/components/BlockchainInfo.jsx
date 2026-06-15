import { shortenAddress } from "../utils/contracts";

function InfoItem({ label, value, highlight }) {
  return (
    <div className="info-item">
      <span>{label}</span>
      <strong className={highlight ? "accent-text" : ""}>{value || "—"}</strong>
    </div>
  );
}

function BlockchainInfo({
  account,
  chainId,
  latestBlock,
  networkId,
  networkName,
  contractAddress,
  contractName,
  onRefresh,
}) {
  return (
    <section className="glass-card blockchain-info">
      <div className="section-heading">
        <div>
          <p className="eyebrow">État réseau</p>
          <h2>Informations Blockchain</h2>
        </div>
        {onRefresh && (
          <button type="button" className="ghost-button" onClick={onRefresh}>
            ↻ Actualiser
          </button>
        )}
      </div>

      <div className="info-grid">
        <InfoItem label="Compte connecté" value={shortenAddress(account)} highlight />
        <InfoItem label="Dernier bloc" value={latestBlock || "Non disponible"} />
        <InfoItem
          label="Réseau"
          value={networkId ? `${networkName} (network ${networkId})` : "Non détecté"}
        />
        <InfoItem label="Chain ID" value={chainId || "Non détecté"} />
        <InfoItem label="Contrat" value={contractName || "Non sélectionné"} />
        <InfoItem
          label="Adresse contrat"
          value={contractAddress ? shortenAddress(contractAddress) : "Non déployé"}
          highlight={Boolean(contractAddress)}
        />
      </div>
    </section>
  );
}

export default BlockchainInfo;