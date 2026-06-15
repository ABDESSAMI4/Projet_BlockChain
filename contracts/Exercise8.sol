// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Payment {
    address public recipient;

    constructor(address _recipient) {
        recipient = _recipient;
    }

    // Accepte un paiement envoye via la fonction.
    function receivePayment() public payable {
        require(msg.value > 0, "Le montant doit etre superieur a 0");
    }

    // Accepte aussi un transfert direct vers l'adresse du contrat.
    receive() external payable {
        require(msg.value > 0, "Le montant doit etre superieur a 0");
    }

    // Transfere tout le solde au destinataire.
    function withdraw() public {
        require(msg.sender == recipient, "Seul le destinataire peut retirer");
        payable(recipient).transfer(address(this).balance);
    }

    // Lit le solde du contrat en wei.
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}