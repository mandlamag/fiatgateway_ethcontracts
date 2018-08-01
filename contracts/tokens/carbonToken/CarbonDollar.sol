pragma solidity ^0.4.23;
import "./dataStorage/MutableCarbonDollarStorage.sol";
import "../permissionedToken/PermissionedToken.sol";
import "../whitelistedToken/WhitelistedToken.sol";

contract CarbonDollar is MutableCarbonDollarStorage, PermissionedToken {
    
    // Events
    event ConvertedToWT(address indexed user, uint256 amount);


    /**
        Modifiers
    */
    modifier requiresWhitelistedToken() {
        require(stablecoinWhitelist.isWhitelisted(msg.sender), "Sender must be a whitelisted token contract");
        _;
    }

    /** CONSTRUCTOR
    * @dev Passes along arguments to base class. 
    */
    constructor(address r, address b, address a, address f, address s) 
    PermissionedToken(r, b, a) 
    MutableCarbonDollarStorage(f, s) public {}

    /**
     * @notice Add new stablecoin to whitelist.
     * @param _stablecoin Address of stablecoin contract.
     */
    function listToken(address _stablecoin) public onlyOwner {
        stablecoinWhitelist.addStablecoin(_stablecoin); 
    }

    /**
     * @notice Remove existing stablecoin from whitelist.
     * @param _stablecoin Address of stablecoin contract.
     */
    function unlistToken(address _stablecoin) public onlyOwner {
        stablecoinWhitelist.removeStablecoin(_stablecoin);
    }

    /**
     * @notice Indicate if stablecoin is whitelisted or not.
     * @param _stablecoin Address of stablecoin contract.
     * @return Whether or not the stablecoin is on the whitelist.
     */
    function isWhitelisted(address _stablecoin) public view returns (bool) {
        return stablecoinWhitelist.isWhitelisted(_stablecoin);
    }

    /**
     * @notice Change fees associated with going from CarbonUSD to a particular stablecoin.
     * @param stablecoin Address of the stablecoin contract.
     * @param _newFee The new fee rate to set, in tenths of a percent. 
     */
    function setFee(address stablecoin, uint16 _newFee) public onlyOwner {
        require(stablecoinWhitelist.isWhitelisted(stablecoin), "Stablecoin must be whitelisted prior to setting conversion fee");
        stablecoinFees.setFee(stablecoin, _newFee);
    }

    /**
     * @notice Change the default fee associated with going from CarbonUSD to a WhitelistedToken.
     * This fee amount is used if the fee for a WhitelistedToken is not specified.
     * @param _newFee The new fee rate to set, in tenths of a percent.
     */
    function setDefaultFee(uint16 _newFee) public onlyOwner {
        stablecoinFees.setDefaultFee(_newFee);
    }

    function getFee(address stablecoin) public view returns (uint16) {
        return stablecoinFees.fees(stablecoin);
    }

    function getDefaultFee() public view returns (uint16) {
        return stablecoinFees.defaultFee();
    }

    /**
     * @notice A whitelisted token can issue CUSD on behalf of a user.
     * @param _to User to send CUSD to
     * @param _amount Amount of CarbonUSD to burn.
     */
    function mint(address _to, uint256 _amount) public requiresWhitelistedToken returns (bool) {
        return _mint(_to, _amount);
    }

    function _mint(address _to, uint256 _amount) internal returns (bool) {
        return super._mint(_to, _amount);
    }

    /**
     * @notice user can convert CarbonUSD umbrella token into the underlying assets. This is potentially interchain (EOS, ETH, Hedera etc)
     * @param stablecoin represents the type of coin the users wishes to receive for burning carbonUSD
     * @param _amount Amount of CarbonUSD to convert.
     * we credit the user's account at the sender address with the _amount minus the percentage fee we want to charge.
     */
    function convertCarbonDollar(address stablecoin, uint256 _amount) public requiresPermission returns (bool) {
        require(stablecoinWhitelist.isWhitelisted(stablecoin), "Stablecoin must be whitelisted prior to setting conversion fee");
        WhitelistedToken w = WhitelistedToken(stablecoin);
        require(w.balanceOf(address(this)) >= _amount, "Carbon escrow account in WT0 doesn't have enough tokens for burning");
 
        // Send back WT0 to calling user, but with a fee reduction.
        // Transfer this fee into this Carbon account (this contract's address)
        uint16 feeRate;
        if (stablecoinFees.isFeeSet(stablecoin)) // If fee for coin is not set
            feeRate = stablecoinFees.fees(stablecoin);
        else
            feeRate = stablecoinFees.defaultFee();

        uint256 chargedFee = stablecoinFees.computeFee(_amount, feeRate);
        uint256 feedAmount = _amount.sub(chargedFee);
        _burn(msg.sender, _amount);
        w.transfer(msg.sender, feedAmount);
        w.burn(chargedFee);
        _mint(address(this), chargedFee);
        emit ConvertedToWT(msg.sender, _amount);
        return true;
    }

    function computeStablecoinFee(uint256 amount, address stablecoin) public view returns (uint256) {
        return stablecoinFees.computeStablecoinFee(amount, stablecoin);
    }
}