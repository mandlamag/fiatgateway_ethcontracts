pragma solidity ^0.4.23;

import "../helpers/PermissionsStorage.sol";

contract PermissionsStorageMock is PermissionsStorage {
    /** 
        @dev Creates permissions for all functions in WhitelistedToken.
     */
    constructor() PermissionsStorage() public {
        // Each of these permission-setting procedures are separated into functions.
        // Because otherwise, Solidity complains about the size that the permission structs
        // take up on the stack if all of the structs are declared in memory within the
        // same function.
        setMintPermission();
        setMintCUSDPermission();
        setBurnPermission();
        setTransferPermission();
        setTransferFromPermission();
        setDestroyBlacklistedTokensPermission();
        setAddBlacklistedAddressSpenderPermission();
        setDestroySelfPermission();
    }

    function setMintPermission() internal {
        Permission memory mint_permission = Permission(
            "Mint", 
            "Allows a trusted minter (e.g. a trust funds) to mint WT0 tokens for a user.", 
            "PermissionedToken");
        addPermission(MINT_SIG, mint_permission);
    }
    
    function setMintCUSDPermission() internal {
        Permission memory mint_cusd_permission = Permission(
            "Mint CUSD", 
            "Allows a trusted minter (e.g. a trust funds) to mint CUSD tokens for a user.", 
            "WhitelistedToken");
        addPermission(MINT_CUSD_SIG, mint_cusd_permission);
    }

    function setBurnPermission() internal {
        Permission memory burn_permission = Permission(
            "Burn", 
            "Allows a user to burn off their own tokens. They can then send this burn transaction as a receipt to a trust fund in order to withdraw collateral", 
            "PermissionedToken");
        addPermission(BURN_SIG, burn_permission);
    }

    function setTransferPermission() internal {
        Permission memory transfer_permission = Permission(
            "Transfer", 
            "Allows a user to transfer their tokens to another user.", 
            "PermissionedToken");
        addPermission(TRANSFER_SIG, transfer_permission);
    }

    function setTransferFromPermission() internal {
        Permission memory transfer_from_permission = Permission(
            "Transfer From", 
            "Allows a user to transfer tokens from one address to another.", 
            "PermissionedToken");
        addPermission(TRANSFER_FROM_SIG, transfer_from_permission);
    }

    function setDestroyBlacklistedTokensPermission() internal {
        Permission memory destroy_tokens_permission = Permission(
            "Destroy User's Blacklisted Tokens", 
            "Allows a regulatory entity to destroy tokens contained within a blacklisted user's account.", 
            "PermissionedToken");
        addPermission(DESTROY_BLACKLISTED_TOKENS_SIG, destroy_tokens_permission);
    }

    function setAddBlacklistedAddressSpenderPermission() internal {
        Permission memory add_blacklisted_spender_permission = Permission(
            "Add Self to Blacklisted Token as an Approved Spender", 
            "Allows a regulatory entity to add themselves as an approved spender on a blacklisted account, in order to transfer tokens out of it.", 
            "PermissionedToken");
        addPermission(ADD_BLACKLISTED_ADDRESS_SPENDER_SIG, add_blacklisted_spender_permission);
    }

    function setDestroySelfPermission() internal {
        Permission memory blacklisted_permission = Permission(
            "Blacklist", 
            "Function is essentially used as a \"marker\" for a blacklisted user.", 
            "PermissionedToken");
        addPermission(BLACKLISTED_SIG, blacklisted_permission);
    }
}