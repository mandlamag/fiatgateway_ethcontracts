
// Regulator 
const PermissionSheet = artifacts.require("PermissionSheet");
const ValidatorSheet = artifacts.require("ValidatorSheet");
const Regulator = artifacts.require("Regulator");
const RegulatorProxy = artifacts.require("RegulatorProxy")
const RegulatorProxyFactory = artifacts.require('RegulatorProxyFactory')
const RegulatorLogicFactory = artifacts.require('RegulatorLogicFactory')

// PermissionedToken
const AllowanceSheet = artifacts.require("AllowanceSheet");
const BalanceSheet = artifacts.require("BalanceSheet");
const PermissionedToken = artifacts.require("PermissionedToken");
const PermissionedTokenStorage = artifacts.require("PermissionedTokenStorage");
const PermissionedTokenProxy = artifacts.require("PermissionedTokenProxy");
const PermissionedTokenLogicFactory = artifacts.require("PermissionedTokenLogicFactory");
const PermissionedTokenProxyFactory = artifacts.require("PermissionedTokenProxyFactory");

// WhitelistedToken
const WhitelistedToken = artifacts.require("WhitelistedToken");
const WhitelistedTokenRegulator = artifacts.require("WhitelistedTokenRegulator");

// CarbonDollar
const CarbonDollar = artifacts.require("CarbonDollar");
const CarbonDollarStorage = artifacts.require("CarbonDollarStorage");
const FeeSheet = artifacts.require("FeeSheet");
const StablecoinWhitelist = artifacts.require("StablecoinWhitelist");
const CarbonDollarRegulator = artifacts.require("CarbonDollarRegulator");
const CarbonDollarProxy = artifacts.require("CarbonDollarProxy");

// Upgradeability
const DelayedUpgradeabilityProxy = artifacts.require("DelayedUpgradeabilityProxy");

module.exports = {
	PermissionSheet,
	ValidatorSheet,
	Regulator,
	RegulatorProxyFactory,
	RegulatorLogicFactory,
	AllowanceSheet,
	BalanceSheet,
	RegulatorProxy,
	PermissionedToken,
	PermissionedTokenStorage,
	PermissionedTokenProxy,
	PermissionedTokenLogicFactory,
	PermissionedTokenProxyFactory,
	WhitelistedToken,
	WhitelistedTokenRegulator,
	CarbonDollarProxy,
	CarbonDollar,
	CarbonDollarStorage,
    FeeSheet,
    StablecoinWhitelist,
	CarbonDollarRegulator,
	DelayedUpgradeabilityProxy
}
