const path = require("path");

module.exports = {
    // Les artefacts Truffle sont generes directement dans React.
    contracts_build_directory: path.join(__dirname, "client", "src", "contracts"),

    networks: {
        // Ganache GUI doit ecouter sur http://127.0.0.1:7545.
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*",
            // Gas limit aligne sur la configuration par defaut de Ganache GUI.
            gas: 6721975,
            gasPrice: 20000000000, // 20 Gwei
        },
    },

    mocha: {
        timeout: 100000,
    },

    compilers: {
        solc: {
            version: "0.8.21",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200,
                },
                // istanbul = compatible Ganache GUI (versions 2.x et 7.x).
                // Ne jamais utiliser "byzantium" avec Solidity >= 0.8 :
                // les opcodes generes sont incompatibles → gas estimation echoue.
                evmVersion: "istanbul",
            },
        },
    },
};