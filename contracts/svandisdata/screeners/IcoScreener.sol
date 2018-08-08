pragma solidity ^0.4.23;

import "../SvandisData.sol";

contract IcoScreener is SvandisData {

    uint public expectedTgeTimestamp;
    bytes32 public ticker;

    constructor(string _name, bytes32 _ticker, string _website, bytes _dataLoad, uint _tokenGenerationEventTimeStamp)
    SvandisData(_name, _website, _dataLoad) public {
        expectedTgeTimestamp = _tokenGenerationEventTimeStamp;
        ticker = _ticker;
    }
}