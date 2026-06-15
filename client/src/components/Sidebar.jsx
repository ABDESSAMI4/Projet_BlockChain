import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { exercises } from "../data/exercises";

const linkClassName = ({ isActive }) =>
  `sidebar-link ${isActive ? "sidebar-link-active" : ""}`;

function Sidebar() {
  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -32, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <NavLink to="/" className="sidebar-brand" aria-label="Accueil">
        <span className="brand-mark">BC</span>
        <span>
          <span className="brand-title">Solidity Lab</span>
          <span className="brand-subtitle">v2.0 · 8 contrats</span>
        </span>
      </NavLink>

      <nav className="sidebar-nav" aria-label="Navigation principale">
        <NavLink to="/" end className={linkClassName}>
          <span className="exercise-index" style={{ fontSize: "0.65rem", letterSpacing: "0.05em" }}>HM</span>
          <span>
            <span className="nav-kicker">Index</span>
            <span className="nav-title">Accueil</span>
          </span>
        </NavLink>

        <div className="sidebar-section-title">Exercices</div>

        {exercises.map((exercise, i) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 + i * 0.04, duration: 0.35, ease: "easeOut" }}
          >
            <NavLink
              to={`/exercises/${exercise.id}`}
              className={linkClassName}
            >
              <span className="exercise-index">E{exercise.id}</span>
              <span>
                <span className="nav-title">{exercise.title}</span>
                <span className="nav-meta">{exercise.status}</span>
              </span>
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </motion.aside>
  );
}

export default Sidebar;