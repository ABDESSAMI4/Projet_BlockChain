// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exercise1 {
    uint public nombre1;
    uint public nombre2;

    // Lit les deux nombres stockes et retourne leur somme.
    function addition1() public view returns (uint) {
        return nombre1 + nombre2;
    }

    // Calcule une somme sans modifier la blockchain.
    function addition2(uint a, uint b) public pure returns (uint) {
        return a + b;
    }

    // Enregistre deux nombres pour les lectures suivantes.
    function setNombres(uint _nombre1, uint _nombre2) public {
        nombre1 = _nombre1;
        nombre2 = _nombre2;
    }
}