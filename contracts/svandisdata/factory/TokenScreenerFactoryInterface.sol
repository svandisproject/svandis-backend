pragma solidity ^0.4.23;


contract TokenScreenerFactoryInterface {
    function newTokenScreener(address _owner, string name, bytes32 ticker, string website, bytes dataLoad) public returns(address newTContract);
}
