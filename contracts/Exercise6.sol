// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exercise6 {
    uint[] public nombres;

    constructor() {
        // Valeurs de depart pour tester les lectures.
        nombres.push(10);
        nombres.push(20);
        nombres.push(30);
        nombres.push(40);
    }

    // Ajoute un nombre au tableau.
    function ajouterNombre(uint _nombre) public {
        nombres.push(_nombre);
    }

    // Lit un element par son index.
    function getElement(uint index) public view returns (uint) {
        require(index < nombres.length, "Index hors limites");
        return nombres[index];
    }

    // Retourne tout le tableau.
    function afficheTableau() public view returns (uint[] memory) {
        return nombres;
    }

    // Additionne toutes les valeurs du tableau.
    function calculerSomme() public view returns (uint) {
        uint somme = 0;

        for (uint i = 0; i < nombres.length; i++) {
            somme += nombres[i];
        }

        return somme;
    }
}