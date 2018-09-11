pragma solidity ^0.4.23;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
//This structure for ERC725/735 implements Origin Protocol Source Code
//https://github.com/OriginProtocol/origin-js/tree/master/contracts

contract UserRegistry is Ownable {
    /*
    * Events
    */

    event NewUser(address _address, address _identity);
    event RemovedUser(address _address, address _identity);

    /*
    * Storage
    */

    // Mapping from ethereum wallet to ERC725 identity
    mapping(address => address) public users;

    /*
    * Public functions
    */

    /// @dev registerUser(): Add a user to the registry
    function registerUser(address _newUser)
      public
    {
        require(tx.origin == owner);
        users[_newUser] = msg.sender;//Will change if we create user - this basically associates key
        emit NewUser(_newUser, msg.sender);
    }

    /// @dev clearUser(): Remove user from the registry
    function clearUser(address _specificUser)
      public
    {
        require(tx.origin == owner);
        address identity = users[_specificUser];
        users[_specificUser] = 0;
        emit RemovedUser(_specificUser, identity);
    }
}
