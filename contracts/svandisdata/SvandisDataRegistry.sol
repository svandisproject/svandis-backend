
pragma solidity ^0.4.23;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './SvandisData.sol';
import './screeners/IcoScreener.sol';
import './screeners/TokenScreener.sol';
import './factory/SvandisDataFactory.sol';

contract SvandisDataRegistry is Ownable {

    address svandisDataFactory;

    mapping(address => uint) public icoScreenerMapping;
    address[] public icoScreenerIndex;

    mapping(address => uint) public tokenScreenerMapping;
    address[] public tokenScreenerIndex;

    constructor(address _svandisDataFactory) public{
        svandisDataFactory = _svandisDataFactory;
    }

    function setSvandisDataFactory(address _svandisDataFactory) public onlyOwner returns (bool){
        svandisDataFactory = _svandisDataFactory;
        return true;
    }
    event Created(address indexed owner, address indexed svandisDataLocation);
    event Deleted(address indexed owner, address indexed svandisDataLocation);
    event Updated(address indexed owner, address indexed svandisDataLocation);

    function createNewTokenScreener(string _name, bytes32 _ticker, string _website, bytes _dataLoad)
    public onlyOwner returns (address newTokenScreener) {
        SvandisDataFactory factory = SvandisDataFactory(svandisDataFactory);
        address tokenScreen = factory.newTokenScreener(_name, _ticker, _website, _dataLoad);

        tokenScreenerMapping[tokenScreen] = icoScreenerIndex.length;
        tokenScreenerIndex.push(tokenScreen);
        emit Created(owner, tokenScreen);
        return tokenScreen;
    }

    function createNewIcoScreener(string _name, bytes32 _ticker, string _website, bytes _dataLoad, uint _tokenGenerationEventTimestamp)
    public onlyOwner returns (address newIcoScreener) {
        SvandisDataFactory factory = SvandisDataFactory(svandisDataFactory);
        address icoScreen = factory.newIcoScreener(_name, _ticker, _website, _dataLoad, _tokenGenerationEventTimestamp);
        icoScreenerMapping[icoScreen] = icoScreenerIndex.length;
        icoScreenerIndex.push(icoScreen);
        emit Created(owner, icoScreen);
        return icoScreen;
    }

    function updateSvandisData(address _svandisDataContract, bytes _newDataLoad) public onlyOwner returns (bool) {
        SvandisData sd = SvandisData(_svandisDataContract);
        require(sd.updateData(_newDataLoad));
        emit Updated(owner, _svandisDataContract);
        return true;
    }

    function deleteIcoMappingData(address _svandisDataContractAddress) public onlyOwner returns (bool) {
        uint location = icoScreenerMapping[_svandisDataContractAddress];
        address svandisDataAddress = icoScreenerIndex[location];
        require(svandisDataAddress == _svandisDataContractAddress);
        //Move last item in the index to location where person was
        icoScreenerIndex[location] = icoScreenerIndex[icoScreenerIndex.length - 1];
        //Update the mapping because last item swapped
        icoScreenerMapping[icoScreenerIndex[icoScreenerIndex.length - 1]] = location;
        //Remove from list
        icoScreenerIndex.length--;
        emit Deleted(owner, _svandisDataContractAddress);
        return true;
    }

    function deleteTokenMappingData(address _svandisDataContractAddress) public onlyOwner returns (bool) {
        uint location = tokenScreenerMapping[_svandisDataContractAddress];
        address svandisDataAddress = tokenScreenerIndex[location];
        require(svandisDataAddress == _svandisDataContractAddress);
        //Move last item in the index to location where person was
        tokenScreenerIndex[location] = tokenScreenerIndex[tokenScreenerIndex.length - 1];
        //Update the mapping because last item swapped
        tokenScreenerMapping[tokenScreenerIndex[tokenScreenerIndex.length - 1]] = location;
        //Remove from list
        tokenScreenerIndex.length--;
        emit Deleted(owner, _svandisDataContractAddress);
        return true;
    }

    function getIcoScreenerCount() public view returns (uint256) {
        return icoScreenerIndex.length;
    }

    function getTokenScreenerCount() public view returns (uint256) {
        return tokenScreenerIndex.length;
    }
}