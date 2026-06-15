const Payment = artifacts.require("Payment");

module.exports = async function (deployer, network, accounts) {
  // Le premier compte Ganache devient le destinataire des retraits.
  const recipient = accounts[0];
  await deployer.deploy(Payment, recipient);
  console.log(`Payment deploye pour ${recipient}`);
};
