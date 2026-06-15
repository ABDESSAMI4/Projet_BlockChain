const Exercise2 = artifacts.require("Exercise2");

module.exports = async function (deployer) {
  // Deploiement de l'exercice 2 sur Ganache.
  await deployer.deploy(Exercise2);
  console.log("Exercise2 deploye");
};
