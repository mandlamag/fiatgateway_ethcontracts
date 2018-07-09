pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/AddressUtils.sol";
import "permissions/PermissionedTokenProxy.sol";
import "permissions/PermissionedToken.sol";

contract CarbonToken is NoOwner {
    mapping (string => address) currencyProxies; // Mapping from currency name to address of currency proxy

    event CurrencyProxyChanged(address oldProxy, address tokenProxy, string currency);
    event CurrencyTokenChanged(address oldToken, address newToken, string currency);

    event CurrencyBalancesMigrated(address oldToken, address newToken, address balances, string currency);
    event CurrencyAllowancesMigrated(address oldToken, address newToken, address allowances, string currency);
    event CurrencyDepositorsMigrated(address oldToken, address newToken, address depositors, string currency);

    function setCurrencyProxy(address proxyAddr, string currency) public onlyOwner returns (address oldProxyAddr) {
        require(AddressUtils.isContract(proxyAddr));
        oldProxyAddr = currencyProxies[currency];
        currencyProxies[currency] = proxyAddr;
        emit ChangedCurrencyProxy(oldProxyAddr, proxyAddr, currency);
    }

    function setCurrencyToken(address tokenAddr, string currency, bool migrateData) public onlyOwner returns (address oldAddr) {
        require(AddressUtils.isContract(currencyProxies[currency]), "Currency proxy not set");
        require(AddressUtils.isContract(tokenAddr), "Token contract address is not valid");
        PermissionedTokenProxy p = PermissionedTokenProxy(currencyProxies[currency]);
        oldAddr = p.implementation();
        p.upgradeTo(tokenAddr);
        if (migrateData) migrateAll(oldAddr, currency);
        emit ChangedCurrencyToken(oldAddr, tokenAddr, currency);
    }

    function migrateAll(address oldTokenAddr, string currency) public onlyOwner {
        migrateBalances(oldTokenAddr, currency);
        migrateAllowances(oldTokenAddr, currency);
        migrateDepositors(oldTokenAddr, currency);
    }

    function migrateBalances(address oldTokenAddr, string currency) public onlyOwner {
        PermissionedToken pOld = PermissionedToken(oldTokenAddr);
        PermissionedTokenProxy pNew = PermissionedTokenProxy(currencyProxies[currency]);
        pNew.setBalanceSheet(pOld.balances);
        emit CurrencyBalancesMigrated(oldTokenAddr, pNew.implementation(), address(pOld.balances), currency);
    }

    function migrateAllowances(address oldTokenAddr, string currency) public onlyOwner {
        PermissionedToken pOld = PermissionedToken(oldTokenAddr);
        PermissionedTokenProxy pNew = PermissionedTokenProxy(currencyProxies[currency]);
        pNew.setAllowanceSheet(pOld.allowances);
        emit CurrencyAllowancesMigrated(oldTokenAddr, pNew.implementation(), address(pOld.allowances), currency);
    }

    function migrateDepositors(address oldTokenAddr, string currency) public onlyOwner {
        PermissionedToken pOld = PermissionedToken(oldTokenAddr);
        PermissionedTokenProxy pNew = PermissionedTokenProxy(currencyProxies[currency]);
        pNew.setAllowanceSheet(pOld.depositors);
        emit CurrencyDepositorsMigrated(oldTokenAddr, pNew.implementation(), address(pOld.depositors), currency);
    }
}