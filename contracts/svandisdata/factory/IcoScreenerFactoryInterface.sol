pragma solidity ^0.4.23;


contract IcoScreenerFactoryInterface {
    function newIcoScreener(string name, bytes32 ticker, string website, bytes dataLoad, uint tokenGenerationEventTimestamp) public returns(address newTContract);
}
