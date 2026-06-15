const Rectangle = artifacts.require("Rectangle");

module.exports = async function (deployer) {
  // Parametres: x, y, longueur, largeur.
  await deployer.deploy(Rectangle, 0, 0, 10, 5);
  console.log("Rectangle deploye");
};
