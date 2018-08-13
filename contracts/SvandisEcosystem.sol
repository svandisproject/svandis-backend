pragma solidity ^0.4.23;
import './token/SvandisToken.sol';
import './svandisdata/SvandisDataRegistry.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';


contract SvandisEcosystem is Ownable{
  //  UserRegistry public userRegistry;
    address public svandisDataRegistry;
    SvandisToken private token;

    constructor(address _token, address _svandisDataReg) public {
        svandisDataRegistry = _svandisDataReg;
        token = SvandisToken(_token);
        owner = msg.sender;
    }

    event Created(address indexed owner, address indexed svandisDataLocation);

    function setSvandisDataRegistry(address _svandisDataReg) public onlyOwner returns (bool){
        svandisDataRegistry = _svandisDataReg;
        return true;
    }

    function createNewTokenScreener (string _name, bytes32 _ticker, string _website, bytes _dataLoad) public onlyOwner returns (address){
        SvandisDataRegistry registry = SvandisDataRegistry(svandisDataRegistry);
        address tokenScreener = registry.createNewTokenScreener(_name, _ticker, _website, _dataLoad);
        emit Created(owner, tokenScreener);
        return tokenScreener;
    }

    function createNewIcoScreener (string _name, bytes32 _ticker, string _website, bytes _dataLoad, uint _tokenGenerationEventTimeStamp) public onlyOwner returns (address){
        SvandisDataRegistry registry = SvandisDataRegistry(svandisDataRegistry);
        address icoScreener = registry.createNewIcoScreener(_name, _ticker, _website, _dataLoad, _tokenGenerationEventTimeStamp);
        emit Created(owner, icoScreener);
        return icoScreener;
    }
}
