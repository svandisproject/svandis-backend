pragma solidity ^0.4.23;

import '../screeners/IcoScreener.sol';
import '../screeners/TokenScreener.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract SvandisDataFactory is Ownable {
    function newTokenScreener(address _owner, string _name, bytes32 _ticker, string _website, bytes _dataLoad) public onlyOwner
    returns(address newContract) {
        return new TokenScreener(_owner, _name, _ticker, _website, _dataLoad);
    }

    function newIcoScreener(address _owner, string _name, bytes32 _ticker, string _website, bytes _dataLoad, uint _tokenGenerationEventTimestamp)
    public onlyOwner returns(address newContract) {
        return new IcoScreener(_owner, _name, _ticker, _website, _dataLoad, _tokenGenerationEventTimestamp);
    }

}
