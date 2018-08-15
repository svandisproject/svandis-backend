pragma solidity ^0.4.23;
//This structure for ERC725/735 implements Origin Protocol Source Code
//https://github.com/OriginProtocol/origin-js/tree/master/contracts

import './ClaimHolderRegistered.sol';

/**
 * NOTE: This contract exists as a convenience for deploying an identity with
 * some 'pre-signed' claims. If you don't care about that, just use ClaimHolder
 * instead.
 */

contract ClaimHolderPresigned is ClaimHolderRegistered {

    constructor(
        address _userRegistryAddress,
        uint256[] _claimType,
        address[] _issuer,
        bytes _signature,
        bytes _data,
        uint256[] _offsets
    )
        ClaimHolderRegistered(_userRegistryAddress)
        public
    {
        ClaimHolderLibrary.addClaims(
            keyHolderData,
            claims,
            _claimType,
            _issuer,
            _signature,
            _data,
            _offsets
        );
    }
}
