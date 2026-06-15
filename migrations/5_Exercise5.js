const Exercise5 = artifacts.require("Exercise5");

module.exports = async function (deployer) {
  // Deploiement de l'exercice 5 sur Ganache.
  await deployer.deploy(Exercise5);
  console.log("Exercise5 deploye");
};
