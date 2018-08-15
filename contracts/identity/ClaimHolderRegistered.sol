pragma solidity ^0.4.23;
//This structure for ERC725/735 implements Origin Protocol Source Code
//https://github.com/OriginProtocol/origin-js/tree/master/contracts

import './ClaimHolder.sol';
import './UserRegistry.sol';

contract ClaimHolderRegistered is ClaimHolder {

  constructor (
    address _userRegistryAddress
  )
      public
  {
      UserRegistry userRegistry = UserRegistry(_userRegistryAddress);
      userRegistry.registerUser();
  }
}
