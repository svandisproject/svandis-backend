pragma solidity ^0.4.24;

import "../SvandisData.sol";

contract IcoScreener is SvandisData {

    uint public expectedTgeTimestamp;
    bytes32 public ticker;

    constructor(address _owner, string memory _name, bytes32 _ticker, string memory _website,  bytes memory _dataLoad, uint _tokenGenerationEventTimeStamp)
    SvandisData(_owner, _name, _website, _dataLoad) public {
        expectedTgeTimestamp = _tokenGenerationEventTimeStamp;
        ticker = _ticker;
    }
}