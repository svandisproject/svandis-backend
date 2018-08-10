pragma solidity ^0.4.23;


contract IcoScreenerFactoryInterface {
    function newIcoScreener(address _owner, string name, bytes32 ticker, string website, bytes dataLoad, uint tokenGenerationEventTimestamp) public returns(address newTContract);
}
