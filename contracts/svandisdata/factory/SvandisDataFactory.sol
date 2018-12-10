pragma solidity ^0.4.24;

import '../screeners/IcoScreener.sol';
import '../screeners/TokenScreener.sol';
import '../../ownership/Ownable.sol';

contract SvandisDataFactory is Ownable {
    function newTokenScreener(address _owner, string memory _name, bytes32 _ticker, string memory _website, bytes memory _dataLoad) public onlyOwner
    returns(address newContract) {
        TokenScreener tscreen = new TokenScreener(_owner, _name, _ticker, _website, _dataLoad);
        return address(tscreen);
    }

    function newIcoScreener(address _owner, string memory _name, bytes32 _ticker, string memory _website, bytes memory _dataLoad, uint _tokenGenerationEventTimestamp)
    public onlyOwner returns(address newContract) {
        IcoScreener iscreen = new IcoScreener(_owner, _name, _ticker, _website, _dataLoad, _tokenGenerationEventTimestamp);
        return address(iscreen);
    }
}
