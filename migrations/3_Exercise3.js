const GestionChaines = artifacts.require("GestionChaines");

module.exports = async function (deployer) {
  // Deploiement du contrat de gestion de chaines.
  await deployer.deploy(GestionChaines);
  console.log("GestionChaines deploye");
};
