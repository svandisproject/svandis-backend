pragma solidity ^0.4.23;

import "../SvandisData.sol";

contract TokenScreener is SvandisData {

    bytes32 public ticker;

    constructor(address _owner, string memory _name, bytes32 _ticker, string memory _website, bytes memory _dataLoad)
    SvandisData(_owner, _name, _website, _dataLoad) public{
        ticker = _ticker;
    }
}