const Exercise6 = artifacts.require("Exercise6");

module.exports = async function (deployer) {
  // Deploiement de l'exercice 6 sur Ganache.
  await deployer.deploy(Exercise6);
  console.log("Exercise6 deploye");
};
