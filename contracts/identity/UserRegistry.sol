pragma solidity ^0.4.23;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
//This structure for ERC725/735 implements Origin Protocol Source Code
//https://github.com/OriginProtocol/origin-js/tree/master/contracts

contract UserRegistry is Ownable {
    /*
    * Events
    */

    event NewUser(address indexed _address, address indexed _identity);
    event SwappedUser(address indexed _address, address indexed _identity);
    event RemovedUser(address indexed _address, address indexed _identity);
    event ExtraUser(address indexed _originalAddress, address indexed _newAddress, address indexed _identity);
    event ChangeUserRating(address indexed _userAddress, address indexed _identityAddress, uint256 _oldRating, uint256 _newRating);

    /*
    * Storage
    */
    // Mapping from ethereum wallet to ERC725 identity
    mapping(address => address) public users;

    // Mapping ERC725 identity to an on chain rating
    mapping(address => uint256) public researchRatings;

    /*
    * Public functions
    */
    function registerUser(address _newUser)
      public
    {
        require(tx.origin == owner);
        users[_newUser] = msg.sender;//Will change if we create user - this basically associates key
        researchRatings[msg.sender] = 1;
        emit NewUser(_newUser, msg.sender);
    }

    function changeUserRating(address _user, uint256 _newRating)
    public
    {
        require(tx.origin == owner);
        uint256 oldRating = researchRatings[users[_user]];
        researchRatings[users[_user]] = _newRating;
        emit ChangeUserRating(_user, users[_user], oldRating, _newRating);
    }

    function swapUser(address _newUser, address _oldUser)
    public
    {
        require(tx.origin == owner);
        users[_newUser] = users[_oldUser];//Will change if we create user - this basically associates key
        clearUser(_oldUser);
        emit SwappedUser(_newUser, msg.sender);
    }

    function addExtraUserAccount(address _originalAddress, address _extraAddress)
    public
    {
        require(tx.origin == owner);
        users[_extraAddress] = users[_originalAddress];//Will change if we create user - this basically associates key
        emit ExtraUser(_originalAddress, _extraAddress, users[_extraAddress]);
    }

    function clearUser(address _specificUser)
      public
    {
        require(tx.origin == owner);
        address identity = users[_specificUser];
        users[_specificUser] = address(0);
        researchRatings[identity] = 0;
        emit RemovedUser(_specificUser, identity);
    }

    function clearSelf()
    public
    {
        address identity = users[msg.sender];
        users[msg.sender] = address(0);
        emit RemovedUser(msg.sender, identity);
    }
}
