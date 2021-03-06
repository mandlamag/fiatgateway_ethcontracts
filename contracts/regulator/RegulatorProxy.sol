pragma solidity ^0.4.24;

import "zos-lib/contracts/upgradeability/UpgradeabilityProxy.sol";
import "./dataStorage/RegulatorStorage.sol";

/**
 * @title RegulatorProxy
 * @dev A RegulatorProxy is a proxy contract that acts identically to a Regulator from the
 * user's point of view. A proxy can change its data storage locations and can also
 * change its implementation contract location. A call to RegulatorProxy delegates the function call
 * to the latest implementation contract's version of the function and the proxy then
 * calls that function in the context of the proxy's data storage
 *
 */
contract RegulatorProxy is UpgradeabilityProxy, RegulatorStorage {

    
    /**
    * @dev CONSTRUCTOR
    * @param _implementation the contract who's logic the proxy will initially delegate functionality to
    **/
    constructor(address _implementation) public UpgradeabilityProxy(_implementation) {}

    /**
    * @dev Upgrade the backing implementation of the proxy.
    * Only the admin can call this function.
    * @param newImplementation Address of the new implementation.
    */
    function upgradeTo(address newImplementation) public onlyOwner {
        _upgradeTo(newImplementation);

    }

      /**
    * @return The address of the implementation.
    */
    function implementation() public view returns (address) {
        return _implementation();
    }
}