// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exercise2 {
    // Convertit un montant en ether vers wei.
    function etherEnWei(uint montantEther) public pure returns (uint) {
        return montantEther * 1 ether;
    }

    // Convertit un montant en wei vers ether entier.
    function weiEnEther(uint montantWei) public pure returns (uint) {
        return montantWei / 1 ether;
    }
}