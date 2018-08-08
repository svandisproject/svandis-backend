pragma solidity ^0.4.23;

import '../screeners/IcoScreener.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract IcoScreenerFactory is Ownable {
    function newIcoScreener(string _name, bytes32 _ticker, string _website, bytes _dataLoad, uint _tokenGenerationEventTimestamp)
    public onlyOwner returns(address newContract){
        IcoScreener screener = new IcoScreener(_name, _ticker, _website, _dataLoad, _tokenGenerationEventTimestamp);
        return screener;
    }
}
