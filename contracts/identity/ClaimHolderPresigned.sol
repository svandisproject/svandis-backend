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
        address _newUserAddress,
        address _backupAddress,
        address _userRegistryAddress,
        uint256[] memory _claimType,
        address[] memory _issuer,
        bytes memory _signature,
        bytes memory _data,
        uint256[] memory _offsets
    )
        ClaimHolderRegistered(_newUserAddress, _backupAddress, _userRegistryAddress)
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
