const Exercise1 = artifacts.require("Exercise1");

module.exports = async function (deployer) {
  // Deploiement de l'exercice 1 sur Ganache.
  await deployer.deploy(Exercise1);
  console.log("Exercise1 deploye");
};
