// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exercise5 {
    // Teste si un nombre est pair.
    function estPair(uint nombre) public pure returns (bool) {
        return nombre % 2 == 0;
    }

    // Teste si un nombre est impair.
    function estImpair(uint nombre) public pure returns (bool) {
        return nombre % 2 != 0;
    }
}