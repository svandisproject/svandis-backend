pragma solidity ^0.4.23;
//This structure for ERC725/735 implements Origin Protocol Source Code
//https://github.com/OriginProtocol/origin-js/tree/master/contracts

import './ClaimHolder.sol';

// This will be deployed exactly once and represents Origin Protocol's
// own identity for use in signing attestations.

contract SvandisOrgIdentity is ClaimHolder {}
