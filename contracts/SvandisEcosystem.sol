pragma solidity ^0.4.23;
import './token/SvandisToken.sol';
import './svandisdata/SvandisDataRegistry.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';


contract SvandisEcosystem is Ownable{
    address public owner;
  //  UserRegistry public userRegistry;
    SvandisDataRegistry public svandisDataRegistry;
    SvandisToken private token;

    constructor(address _token, address _svandisDataReg) public {
        owner = msg.sender;
        svandisDataRegistry = new SvandisDataRegistry(_svandisDataReg);
        token = SvandisToken(_token);
    }

    function setSvandisDataRegistry(address _svandisDataReg) public onlyOwner returns (bool){
        svandisDataRegistry = new SvandisDataRegistry(_svandisDataReg);
        return true;
    }

    function createNewTokenScreener (string _name, bytes32 _ticker, string _website, bytes _dataLoad) public onlyOwner returns (address){
        return svandisDataRegistry.createNewTokenScreener(_name, _ticker, _website, _dataLoad);
    }

    function createNewIcoScreener (string _name, bytes32 _ticker, string _website, bytes _dataLoad, uint _tokenGenerationEventTimeStamp) public onlyOwner returns (address){
        return svandisDataRegistry.createNewIcoScreener(_name, _ticker, _website, _dataLoad, _tokenGenerationEventTimeStamp);
    }
}
