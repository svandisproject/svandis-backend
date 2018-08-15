pragma solidity ^0.4.23;

//This structure for ERC725/735 implements Origin Protocol Source Code
//https://github.com/OriginProtocol/origin-js/tree/master/contracts

contract UserRegistry {
    /*
    * Events
    */

    event NewUser(address _address, address _identity);

    /*
    * Storage
    */

    // Mapping from ethereum wallet to ERC725 identity
    mapping(address => address) public users;

    /*
    * Public functions
    */

    /// @dev registerUser(): Add a user to the registry
    function registerUser()
      public
    {
        users[tx.origin] = msg.sender;
        emit NewUser(tx.origin, msg.sender);
    }

    /// @dev clearUser(): Remove user from the registry
    function clearUser()
      public
    {
        users[msg.sender] = 0;
    }
}
