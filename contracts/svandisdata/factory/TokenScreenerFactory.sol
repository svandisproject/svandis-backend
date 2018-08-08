pragma solidity ^0.4.23;

import '../screeners/TokenScreener.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract TokenScreenerFactory is Ownable{
    function newTokenScreener(string _name, bytes32 _ticker, string _website, bytes _dataLoad)
    public onlyOwner returns (address newContract){
        TokenScreener screener = new TokenScreener(_name, _ticker, _website, _dataLoad);
        return screener;
     }
}