pragma solidity ^0.4.23;

import '../regulator/RegulatorProxy.sol';
import '../regulator/mocks/PermissionSheetMock.sol';
import '../regulator/dataStorage/ValidatorSheet.sol';
import "openzeppelin-solidity/contracts/AddressUtils.sol";



/**
*
* @dev RegulatorProxyFactory creates new RegulatorProxy contracts instantiated with data stores. Its PermissionSheet
* is pre-loaded with all permissions added. 
*
**/
contract RegulatorProxyFactory {

	// Parameters
	address[] public regulators;

	// Events
	event CreatedRegulatorProxy(address newRegulator, uint index);

	// Return number of proxies created 
	function getCount() public view returns (uint) {
		return regulators.length;
	}

	// Return the i'th created proxy
	function getRegulator(uint i) public view returns(address) {
		return regulators[i];
	}

	/**
	*
	* @dev generate a new proxyaddress that users can cast to a Regulator or ReegulatorProxy. The
	* proxy has empty data storage contracts connected to it and it is set with an initial logic contract
	* to which it will delegate functionality
	* @param regulatorImplementation the address of the logic contract that the proxy will initialize its implementation to
	*
	**/
	function createRegulator(address regulatorImplementation) public {
		require(AddressUtils.isContract(regulatorImplementation), "Cannot set a proxy implementation to a non-contract address");

		// Store new data storage contracts for regulator proxy
		address permissions = address(new PermissionSheetMock()); // All permissions added
		address validators = address(new ValidatorSheet());

		address proxy = address(new RegulatorProxy(regulatorImplementation, permissions, validators));

		// data storages should ultimately point be owned by the proxy, since it will delegate function
		// calls to the latest implementation *in the context of the proxy contract*
		PermissionSheet(permissions).transferOwnership(address(proxy));
		ValidatorSheet(validators).transferOwnership(address(proxy));

		// The function caller should own the proxy contract
		RegulatorProxy(proxy).transferOwnership(msg.sender);

		regulators.push(proxy);
		emit CreatedRegulatorProxy(proxy, getCount()-1);
	}

}
