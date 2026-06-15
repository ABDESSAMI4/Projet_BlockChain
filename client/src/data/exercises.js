import Exercise1Artifact from "../contracts/Exercise1.json";
import Exercise2Artifact from "../contracts/Exercise2.json";
import Exercise4Artifact from "../contracts/Exercise4.json";
import Exercise5Artifact from "../contracts/Exercise5.json";
import Exercise6Artifact from "../contracts/Exercise6.json";
import GestionChainesArtifact from "../contracts/GestionChaines.json";
import PaymentArtifact from "../contracts/Payment.json";
import RectangleArtifact from "../contracts/Rectangle.json";

const uintInput = (name, label, defaultValue = "0") => ({
  name,
  label,
  defaultValue,
  type: "number",
  min: "0",
  step: "1",
});

const intInput = (name, label, defaultValue = "0") => ({
  name,
  label,
  defaultValue,
  type: "number",
  step: "1",
});

const textInput = (name, label, defaultValue = "") => ({
  name,
  label,
  defaultValue,
  type: "text",
});

const etherInput = (name, label, defaultValue = "0.01") => ({
  name,
  label,
  defaultValue,
  type: "number",
  min: "0",
  step: "0.001",
});

export const exercises = [
  {
    id: 1,
    title: "Variables et addition",
    summary: "Lire, modifier deux nombres, puis calculer leur somme.",
    status: "Complet",
    contractName: "Exercise1",
    artifact: Exercise1Artifact,
    readActions: [
      { id: "nombre1", label: "Lire nombre1", method: "nombre1", autoLoad: true },
      { id: "nombre2", label: "Lire nombre2", method: "nombre2", autoLoad: true },
      { id: "addition1", label: "Addition des valeurs stockees", method: "addition1", autoLoad: true },
      {
        id: "addition2",
        label: "Addition libre",
        method: "addition2",
        inputs: [uintInput("a", "Nombre A", "12"), uintInput("b", "Nombre B", "30")],
      },
    ],
    writeActions: [
      {
        id: "setNombres",
        label: "Modifier les deux nombres",
        method: "setNombres",
        inputs: [uintInput("nombre1", "Nombre 1", "10"), uintInput("nombre2", "Nombre 2", "20")],
      },
    ],
  },
  {
    id: 2,
    title: "Conversions ether / wei",
    summary: "Convertir des montants entre ether et wei.",
    status: "Complet",
    contractName: "Exercise2",
    artifact: Exercise2Artifact,
    readActions: [
      {
        id: "etherEnWei",
        label: "Ether vers wei",
        method: "etherEnWei",
        inputs: [uintInput("montantEther", "Montant en ether", "1")],
      },
      {
        id: "weiEnEther",
        label: "Wei vers ether",
        method: "weiEnEther",
        inputs: [uintInput("montantWei", "Montant en wei", "1000000000000000000")],
      },
    ],
    writeActions: [],
  },
  {
    id: 3,
    title: "Gestion de chaines",
    summary: "Stocker, concatener, mesurer et comparer des textes on-chain.",
    status: "Complet",
    contractName: "GestionChaines",
    artifact: GestionChainesArtifact,
    readActions: [
      { id: "getMessage", label: "Lire le message", method: "getMessage", autoLoad: true },
      {
        id: "concatener",
        label: "Concatener deux textes",
        method: "concatener",
        inputs: [textInput("a", "Texte A", "Solidity "), textInput("b", "Texte B", "Lab")],
      },
      {
        id: "concatenerAvec",
        label: "Ajouter au message stocke",
        method: "concatenerAvec",
        inputs: [textInput("texte", "Texte a ajouter", " est pret")],
      },
      {
        id: "longueur",
        label: "Calculer la longueur",
        method: "longueur",
        inputs: [textInput("texte", "Texte a mesurer", "Projet blockchain")],
      },
      {
        id: "comparer",
        label: "Comparer deux textes",
        method: "comparer",
        inputs: [textInput("a", "Texte A", "web3"), textInput("b", "Texte B", "web3")],
      },
    ],
    writeActions: [
      {
        id: "setMessage",
        label: "Modifier le message",
        method: "setMessage",
        inputs: [textInput("message", "Nouveau message", "Bonjour Blockchain")],
      },
    ],
  },
  {
    id: 4,
    title: "Conditions",
    summary: "Verifier si un entier est positif.",
    status: "Complet",
    contractName: "Exercise4",
    artifact: Exercise4Artifact,
    readActions: [
      {
        id: "estPositif",
        label: "Tester un entier",
        method: "estPositif",
        inputs: [intInput("nombre", "Nombre", "7")],
      },
    ],
    writeActions: [],
  },
  {
    id: 5,
    title: "Pair et impair",
    summary: "Tester la parite d'un nombre.",
    status: "Complet",
    contractName: "Exercise5",
    artifact: Exercise5Artifact,
    readActions: [
      {
        id: "estPair",
        label: "Tester pair",
        method: "estPair",
        inputs: [uintInput("nombre", "Nombre", "24")],
      },
      {
        id: "estImpair",
        label: "Tester impair",
        method: "estImpair",
        inputs: [uintInput("nombre", "Nombre", "13")],
      },
    ],
    writeActions: [],
  },
  {
    id: 6,
    title: "Tableaux",
    summary: "Ajouter des nombres, lire un index et calculer la somme.",
    status: "Complet",
    contractName: "Exercise6",
    artifact: Exercise6Artifact,
    readActions: [
      { id: "afficheTableau", label: "Lire tout le tableau", method: "afficheTableau", autoLoad: true },
      { id: "calculerSomme", label: "Calculer la somme", method: "calculerSomme", autoLoad: true },
      {
        id: "getElement",
        label: "Lire un element",
        method: "getElement",
        inputs: [uintInput("index", "Index", "0")],
      },
    ],
    writeActions: [
      {
        id: "ajouterNombre",
        label: "Ajouter un nombre",
        method: "ajouterNombre",
        inputs: [uintInput("nombre", "Nombre a ajouter", "50")],
      },
    ],
  },
  {
    id: 7,
    title: "Heritage et formes",
    summary: "Lire et deplacer un rectangle Solidity.",
    status: "Complet",
    contractName: "Rectangle",
    artifact: RectangleArtifact,
    readActions: [
      { id: "afficheInfos", label: "Lire le type", method: "afficheInfos", autoLoad: true },
      { id: "afficheXY", label: "Lire les coordonnees", method: "afficheXY", autoLoad: true },
      { id: "afficheLoLa", label: "Lire longueur et largeur", method: "afficheLoLa", autoLoad: true },
      { id: "surface", label: "Calculer la surface", method: "surface", autoLoad: true },
      { id: "x", label: "Lire x", method: "x", autoLoad: true },
      { id: "y", label: "Lire y", method: "y", autoLoad: true },
    ],
    writeActions: [
      {
        id: "deplacerForme",
        label: "Deplacer le rectangle",
        method: "deplacerForme",
        inputs: [uintInput("dx", "Deplacement X", "1"), uintInput("dy", "Deplacement Y", "2")],
      },
    ],
  },
  {
    id: 8,
    title: "Paiement",
    summary: "Envoyer, recevoir et retirer des ethers Ganache.",
    status: "Complet",
    contractName: "Payment",
    artifact: PaymentArtifact,
    readActions: [
      { id: "recipient", label: "Lire le destinataire", method: "recipient", autoLoad: true },
      { id: "getBalance", label: "Lire le solde du contrat", method: "getBalance", autoLoad: true, format: "ether" },
    ],
    writeActions: [
      {
        id: "receivePayment",
        label: "Envoyer un paiement",
        method: "receivePayment",
        payable: true,
        valueInput: etherInput("valueEth", "Montant en ETH", "0.01"),
      },
      {
        id: "withdraw",
        label: "Retirer le solde",
        method: "withdraw",
      },
    ],
  },
];

export const getExercise = (id) =>
  exercises.find((exercise) => exercise.id === Number(id));
