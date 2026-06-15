// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GestionChaines {
    string public message = "Bonjour Solidity";

    // Modifie le message stocke dans le contrat.
    function setMessage(string memory _message) public {
        message = _message;
    }

    // Lit le message courant.
    function getMessage() public view returns (string memory) {
        return message;
    }

    // Assemble deux chaines passees en parametres.
    function concatener(string memory a, string memory b) public pure returns (string memory) {
        return string.concat(a, b);
    }

    // Assemble le message stocke avec une autre chaine.
    function concatenerAvec(string memory _texte) public view returns (string memory) {
        return string.concat(message, _texte);
    }

    // Retourne la longueur en octets de la chaine.
    function longueur(string memory _texte) public pure returns (uint) {
        return bytes(_texte).length;
    }

    // Compare deux chaines avec leur hash.
    function comparer(string memory a, string memory b) public pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }
}