var ValidatorSheetFactory = artifacts.require("./ValidatorSheetFactory");
var PermissionSheetMockFactory = artifacts.require("./PermissionSheetMockFactory")
var WhitelistedTokenRegulator = artifacts.require("./WhitelistedTokenRegulator");

// Deploy a new WT regulator using new Permission and Validator sheet instances
module.exports = function(deployer, network, accounts) {
  let wtRegulatorOwner = accounts[0];

  deployer.deploy(WhitelistedTokenRegulator, null, null, { from: wtRegulatorOwner })
};