pragma solidity ^0.4.23;

import './IcoScreenerFactoryInterface.sol';
import './TokenScreenerFactoryInterface.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract SvandisDataFactory is TokenScreenerFactoryInterface, IcoScreenerFactoryInterface, Ownable {
    address tokenScreenerFactoryAddress;
    address icoScreenerFactoryAddress;

    constructor (address _tokenScreenerFactory, address _icoScreenerFactory) public{
        tokenScreenerFactoryAddress = _tokenScreenerFactory;
        icoScreenerFactoryAddress = _icoScreenerFactory;
    }

    function setTokenScreenerFactoryAddress(address _tokenScreenerFactory) public onlyOwner returns (bool){
        tokenScreenerFactoryAddress = _tokenScreenerFactory;
        return true;
    }

    function setIcoScreenerFactoryAddress(address _icoScreenerFactory) public onlyOwner returns (bool){
        icoScreenerFactoryAddress = _icoScreenerFactory;
        return true;
    }

    function newTokenScreener(string _name, bytes32 _ticker, string _website, bytes _dataLoad) public onlyOwner
    returns(address newContract) {
        TokenScreenerFactoryInterface factory = TokenScreenerFactoryInterface(tokenScreenerFactoryAddress);
        return factory.newTokenScreener(_name, _ticker, _website, _dataLoad);
    }

    function newIcoScreener(string _name, bytes32 _ticker, string _website, bytes _dataLoad, uint _tokenGenerationEventTimestamp)
    public onlyOwner returns(address newContract) {
        IcoScreenerFactoryInterface factory = IcoScreenerFactoryInterface(icoScreenerFactoryAddress);
        return factory.newIcoScreener(_name, _ticker, _website, _dataLoad, _tokenGenerationEventTimestamp);
    }

}
