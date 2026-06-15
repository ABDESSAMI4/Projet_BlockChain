import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BlockchainInfo from "../components/BlockchainInfo";
import { exercises } from "../data/exercises";

function Home({ blockchain }) {
  return (
    <motion.div
      className="page-stack"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <section className="hero-panel">
        <div className="hero-content">
          <p className="eyebrow">Truffle, React, Web3.js</p>
          <h2>Tableau de bord pour 8 contrats Solidity.</h2>
          <p>
            Lance Ganache GUI, connecte MetaMask au reseau local, puis ouvre un
            exercice pour lire les donnees et envoyer des transactions.
          </p>
          <div className="hero-actions">
            <Link to="/exercises/1" className="primary-button">
              Ouvrir l'exercice 1
            </Link>
            <a href="#sommaire" className="secondary-button">
              Voir le sommaire
            </a>
          </div>
        </div>

        <div className="hero-stats" aria-label="Resume du projet">
          <div>
            <span>8</span>
            <p>Exercices</p>
          </div>
          <div>
            <span>8</span>
            <p>Contrats</p>
          </div>
          <div>
            <span>{blockchain?.latestBlock || "-"}</span>
            <p>Dernier bloc</p>
          </div>
        </div>
      </section>

      <BlockchainInfo {...blockchain} />

      <section id="sommaire" className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Sommaire</p>
            <h2>Choisir un exercice</h2>
          </div>
        </div>

        <div className="exercise-grid">
          {exercises.map((exercise, index) => (
            <motion.article
              className="exercise-card"
              key={exercise.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              <div className="card-topline">
                <span className="exercise-index">E{exercise.id}</span>
                <span className="status-badge status-ready">{exercise.status}</span>
              </div>
              <h3>{exercise.title}</h3>
              <p>{exercise.summary}</p>
              <Link to={`/exercises/${exercise.id}`} className="card-link">
                Acceder
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default Home;
