const contract = require("truffle-contract");

// ABI's of contracts
const CarbonDollarProxyFactory_abi = require('../build/contracts/CarbonDollarProxyFactory.json')
const WhitelistedTokenProxyFactory_abi = require('../build/contracts/WhitelistedTokenProxyFactory.json')
const CarbonDollar_abi = require('../build/contracts/CarbonDollar.json')
const WhitelistedToken_abi = require('../build/contracts/WhitelistedToken.json')

// Addresses of contracts
const { WTFactory,
        CUSDFactory,
        mintRecipient,
        minterCUSD } = require('./addresses')

let CarbonDollarProxyFactory = contract(CarbonDollarProxyFactory_abi);
let WhitelistedTokenProxyFactory = contract(WhitelistedTokenProxyFactory_abi);
let CarbonDollar = contract(CarbonDollar_abi)
let WhitelistedToken = contract(WhitelistedToken_abi)

// Set providers
CarbonDollarProxyFactory.setProvider(web3.currentProvider)
WhitelistedTokenProxyFactory.setProvider(web3.currentProvider)
CarbonDollar.setProvider(web3.currentProvider)
WhitelistedToken.setProvider(web3.currentProvider)

// Specific token addresses
let WT0
let CUSD

module.exports = function(callback) {

    console.log('user: ' + mintRecipient)

    // 3) WT mints to user
    WhitelistedTokenProxyFactory.at(WTFactory).then(wtInstance => {
        wtInstance.getToken(0).then(createdWTToken => {
            WhitelistedToken.at(createdWTToken).then(wtToken => {
                WT0 = wtToken
                console.log("WT: " + WT0.address)
                WT0.mintCUSD(mintRecipient, 10 * 10 ** 18, {from:minterCUSD}).then(tx => {
                }).catch(error => {
                    console.log(error)
                })
                CarbonDollarProxyFactory.at(CUSDFactory).then(cdInstance => {
                    cdInstance.getToken(0).then(createdCDToken => {
                        CarbonDollar.at(createdCDToken).then(cdToken => {
                            CUSD = cdToken
                            console.log("CUSD: " + CUSD.address)
                        })
                    })
                })
            })
        })
    })
}
