import { motion } from "framer-motion";
import { shortenAddress } from "../utils/contracts";

function Navbar({
  account,
  latestBlock,
  networkName,
  theme,
  connectionError,
  isSupportedNetwork,
  onConnect,
  onSwitchNetwork,
  onToggleTheme,
}) {
  const isConnected = Boolean(account);

  return (
    <motion.header
      className="navbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <p className="eyebrow">Projet de Fin de Module</p>
        <h1 className="navbar-title">dApp Solidity professionnelle</h1>
      </div>

      <div className="navbar-actions">
        <div className="network-pill" title="Réseau détecté">
          <span className={`status-dot ${isSupportedNetwork ? "online" : ""}`} />
          <span>{networkName || "Réseau inconnu"}</span>
          <span className="muted">#{latestBlock || "—"}</span>
        </div>

        {!isSupportedNetwork && (
          <button type="button" className="ghost-button" onClick={onSwitchNetwork}>
            → Ganache
          </button>
        )}

        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Changer le thème"
        >
          {theme === "dark" ? "☀ Light" : "◑ Dark"}
        </button>

        <button
          type="button"
          className={`wallet-button ${isConnected ? "wallet-connected" : ""}`}
          onClick={onConnect}
        >
          {isConnected ? `⬡ ${shortenAddress(account)}` : "Connect Wallet"}
        </button>
      </div>

      {connectionError && (
        <p className="navbar-error" role="alert">
          ⚠ {connectionError}
        </p>
      )}
    </motion.header>
  );
}

export default Navbar;