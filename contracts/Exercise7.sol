// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract Forme {
    uint public x;
    uint public y;

    constructor(uint _x, uint _y) {
        x = _x;
        y = _y;
    }

    // Deplace la forme dans le plan.
    function deplacerForme(uint dx, uint dy) public {
        x += dx;
        y += dy;
    }

    // Affiche les coordonnees courantes.
    function afficheXY() public view returns (string memory) {
        return string.concat("x = ", uint2str(x), ", y = ", uint2str(y));
    }

    function afficheInfos() public virtual pure returns (string memory);

    function surface() public virtual view returns (uint);

    // Convertit un uint en chaine pour l'affichage.
    function uint2str(uint _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }

        uint j = _i;
        uint len;

        while (j != 0) {
            len++;
            j /= 10;
        }

        bytes memory bstr = new bytes(len);

        while (_i != 0) {
            bstr[--len] = bytes1(uint8(48 + (_i % 10)));
            _i /= 10;
        }

        return string(bstr);
    }
}

contract Rectangle is Forme {
    uint public lo;
    uint public la;

    constructor(uint _x, uint _y, uint _lo, uint _la) Forme(_x, _y) {
        lo = _lo;
        la = _la;
    }

    // Calcule la surface du rectangle.
    function surface() public view override returns (uint) {
        return lo * la;
    }

    // Retourne une description simple du type.
    function afficheInfos() public pure override returns (string memory) {
        return "Je suis un Rectangle";
    }

    // Affiche la longueur et la largeur.
    function afficheLoLa() public view returns (string memory) {
        return string.concat("Longueur = ", uint2str(lo), ", Largeur = ", uint2str(la));
    }
}