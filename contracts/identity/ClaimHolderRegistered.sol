pragma solidity ^0.4.23;
//This structure for ERC725/735 implements Origin Protocol Source Code
//https://github.com/OriginProtocol/origin-js/tree/master/contracts

import './ClaimHolder.sol';
import './UserRegistry.sol';

contract ClaimHolderRegistered is ClaimHolder {

  constructor (
        address _newUserAddress,
        address _backupAddress,
        address _userRegistryAddress
  )
      ClaimHolder(_newUserAddress, _backupAddress)
      public
  {
      UserRegistry userRegistry = UserRegistry(_userRegistryAddress);
      userRegistry.registerUser(_newUserAddress);
  }
}
