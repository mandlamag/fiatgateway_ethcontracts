/* Loading all imports */
const _ = require('lodash');
const expectRevert = require('./utils/expectRevert');
const expectThrow = require('./utils/expectThrow');
const assertBalance = require('./utils/assertBalance');
const depositFunds = require('./utils/depositFunds');
const BigNumber = web3.BigNumber;
const ZERO_ADDRESS = 0x0000000000000000000000000000000000000000;
const RANDOM_ADDRESS = 0x3b5855bAEF50EBFdFC89c5E5463f92BCe194EAc9; 

/** Contract classes **/
// TrueUSD ERC20 contract tests
const transfersToZeroBecomeBurns = false;

// Regulator and storage classes for regulator
const Regulator = artifacts.require("Regulator");
const RegulatorMock = artifacts.require("RegulatorMock");
const RegulatorProxy = artifacts.require("RegulatorProxy");
// PermissionedToken
const BalanceSheet = artifacts.require("BalanceSheet");
const AllowanceSheet = artifacts.require("AllowanceSheet");
const MutablePermissionedToken = artifacts.require("MutablePermissionedToken");
const MutablePermissionedTokenMock = artifacts.require("MutablePermissionedTokenMock");
const ImmutablePermissionedToken = artifacts.require("ImmutablePermissionedToken");
const ImmutablePermissionedTokenMock = artifacts.require("ImmutablePermissionedTokenMock");
const MutablePermissionedTokenProxy = artifacts.require("MutablePermissionedTokenProxy");
// WT0
const WhitelistedToken = artifacts.require("WhitelistedToken");
const WhitelistedTokenRegulator = artifacts.require("WhitelistedTokenRegulator");
const WhitelistedTokenRegulatorMock = artifacts.require("WhitelistedTokenRegulatorMock");
const WhitelistedTokenRegulatorProxy = artifacts.require("WhitelistedTokenRegulatorProxy");
// Storage classes for CarbonDollar
const FeeSheet = artifacts.require("FeeSheet");
const StablecoinWhitelist = artifacts.require("StablecoinWhitelist");
// CarbonUSD
const CarbonDollar = artifacts.require("CarbonDollar");
const CarbonDollarMock = artifacts.require("CarbonDollarMock");
const CarbonUSD = artifacts.require("CarbonUSD");

require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .use(require('chai-as-promised'))
    .should();//To enable should chai style

/* Creating a class with all common Variables */
class CommonVariables {
    constructor(_accounts) {
        this.accounts = _accounts;
        this.owner = _accounts[0];
        this.user = _accounts[1];
        this.attacker = _accounts[2];
        this.user2 = _accounts[3];
        this.user3 = _accounts[4];
        this.validator = _accounts[5];
        this.validator2 = _accounts[6];
    }
}

/* Exporting the module */
module.exports = {
    BigNumber,
    expectRevert,
    expectThrow,
    depositFunds,
    assertBalance,
    CommonVariables,
    ZERO_ADDRESS,
    RANDOM_ADDRESS,
    transfersToZeroBecomeBurns,
    Regulator,
    RegulatorMock,
    RegulatorProxy,
    BalanceSheet,
    AllowanceSheet,
    MutablePermissionedToken,
    MutablePermissionedTokenMock,
    ImmutablePermissionedToken,
    ImmutablePermissionedTokenMock,
    MutablePermissionedTokenProxy,
    WhitelistedToken,
    WhitelistedTokenRegulator,
    WhitelistedTokenRegulatorMock,
    WhitelistedTokenRegulatorProxy,
    FeeSheet,
    StablecoinWhitelist,
    CarbonDollar,
    CarbonDollarMock,
    CarbonUSD
}