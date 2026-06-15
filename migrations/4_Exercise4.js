const Exercise4 = artifacts.require("Exercise4");

module.exports = async function (deployer) {
  // Deploiement de l'exercice 4 sur Ganache.
  await deployer.deploy(Exercise4);
  console.log("Exercise4 deploye");
};
