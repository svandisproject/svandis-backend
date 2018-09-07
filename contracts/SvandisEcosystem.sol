pragma solidity ^0.4.23;
import './token/SvandisToken.sol';
import './svandisdata/SvandisDataRegistry.sol';
import './identity/UserRegistry.sol';
import './identity/ClaimHolderPresigned.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';


contract SvandisEcosystem is Ownable{
    address public userRegistry;
    address public svandisDataRegistry;
    SvandisToken private token;

    constructor(address _token, address _svandisDataReg, address _userReg) public {
        svandisDataRegistry = _svandisDataReg;
        userRegistry = _userReg;
        token = SvandisToken(_token);
        owner = msg.sender;
    }

    event Created(address indexed owner, address indexed svandisDataLocation);
    event Updated(address indexed owner, address indexed svandisDataLocation);
    event NewUserCreated(address indexed owner,
        address indexed _userRegistryAddress,
        uint256[] _claimType,
        address[] indexed _issuer,
        bytes _signature,
        bytes _data,
        uint256[] _offsets);

    function setSvandisDataRegistry(address _svandisDataReg) public onlyOwner returns (bool){
        svandisDataRegistry = _svandisDataReg;
        return true;
    }

    function setUserRegistry(address _userReg) public onlyOwner returns (bool){
        userRegistry = _userReg;
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

    function updateSvandisData (address _dataAddress, bytes _newData) public onlyOwner returns (bool){
        SvandisDataRegistry registry = SvandisDataRegistry(svandisDataRegistry);
        bool success = registry.updateSvandisData(_dataAddress, _newData);
        emit Updated(owner, _dataAddress);
        return success;
    }

    function getIdentityFromRegistry(address _identity) public returns (address){
        UserRegistry usersRegistry = UserRegistry(userRegistry);
        return usersRegistry.users(_identity);
    }


    function createNewUser(address _newUserAddress,
        address _backupAddress,
        uint256[] _claimType,
        address[] _issuer,
        bytes _signature,
        bytes _data,
        uint256[] _offsets) public onlyOwner returns (address){
        return new ClaimHolderPresigned(
            _newUserAddress,
            _backupAddress,
            userRegistry,
            _claimType,
            _issuer,
            _signature,
            _data,
            _offsets);
    }
}
