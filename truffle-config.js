/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

const HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config()  // Store environment-specific variable from '.env' to process.env

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    // Test RPC environment
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", //Listen to all networks,
      gasLimit: 6000000
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8555,         // <-- If you change this, also set the port option in .solcover.js.
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01      // <-- Use this low gas price
    },
    rinkeby: {
      provider: function () {
          return new HDWalletProvider(process.env.MNEMONIC, "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY)
      },
      network_id: 4,
    },
    ropsten: {
      provider: function () {
          return new HDWalletProvider(process.env.OWNER_KEY, "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY_MAIN)
      },
      network_id: 3,
    },
    mainnet: {
      provider: function () {
          return new HDWalletProvider(process.env.OWNER_KEY, "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY_MAIN)
      },
      network_id: 1,
      gas: 7000000, // Largest contracts can take almost 7mm gas
      gasPrice: 35000000000, // 35 GWei, should be very fast: https://ethgasstation.info/
    }
  },
  // mocha: { // Uncomment to turn on gas reporter, slows down transactions
  //   reporter: 'eth-gas-reporter',
  //   reporterOptions: {
  //     gasPrice: 21
  //   }
  // },
  solc: { 
    optimizer: { // deployed Sep18 { enabled: true, runs: 200 }
      enabled: true,
      runs: 200
    }
  }
};
