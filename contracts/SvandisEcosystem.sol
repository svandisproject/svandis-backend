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

    function updateSvandisData (address _dataAddress,
        bytes _newData,
        address[] _consensusUsers,
        uint256[] _consensusUserNewRatings,
        bool[] _metConsensus)
        public onlyOwner returns (bool){
            require(_consensusUsers.length == _consensusUserNewRatings.length);
            require(_consensusUsers.length == _metConsensus.length);
            SvandisDataRegistry registry = SvandisDataRegistry(svandisDataRegistry);
            bool success = registry.updateSvandisData(_dataAddress, _newData);
            UserRegistry usersRegistry = UserRegistry(userRegistry);
            for(uint i=0; i<_consensusUsers.length; i++){
                usersRegistry.changeUserRating(_consensusUsers[i], _consensusUserNewRatings[i]);
                if(_metConsensus[i]==true){
                //Todo token rewards based on whether user met consensus off chain
                }
            }
            emit Updated(owner, _dataAddress);
            return success;
    }

    function getIdentityFromRegistry(address _user) public returns (address){
        UserRegistry usersRegistry = UserRegistry(userRegistry);
        return usersRegistry.users(_user);
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

    function createNewCentralizedUser(address _newUserAddress,
        uint256[] _claimType,
        address[] _issuer,
        bytes _signature,
        bytes _data,
        uint256[] _offsets) public onlyOwner returns (address){
            return new ClaimHolderPresigned(
            _newUserAddress,
            address(this),
            userRegistry,
            _claimType,
            _issuer,
            _signature,
            _data,
            _offsets);
    }

    function removeUser(address _userToBeRemoved) public onlyOwner {
        UserRegistry usersRegistry = UserRegistry(userRegistry);
        usersRegistry.clearUser(_userToBeRemoved);
    }

     //Only for accounts with svandis as recovery mechanism
     function swapMainKeyForSvandisCentralizedUserAccounts(address _oldUserAddress, address _newUserAddress) public onlyOwner returns (bool){
        address identity = getIdentityFromRegistry(_oldUserAddress);
        ClaimHolderPresigned identityKeyHolder = ClaimHolderPresigned(identity);
        identityKeyHolder.removeKey(keccak256(_oldUserAddress));
        identityKeyHolder.addKey(keccak256(_newUserAddress), 1, 1);
        UserRegistry usersRegistry = UserRegistry(userRegistry);
        usersRegistry.swapUser(_newUserAddress, _oldUserAddress);
        return true;
     }

     //Only for accounts with svandis as recovery mechanism
    function addExtraKeyForSvandisCentralizedUserAccounts(address _originalAddress, address _extraUserAddress) public onlyOwner returns (bool){
        address identity = getIdentityFromRegistry(_originalAddress);
        ClaimHolderPresigned identityKeyHolder = ClaimHolderPresigned(identity);
        identityKeyHolder.addKey(keccak256(_extraUserAddress), 1, 1);
        UserRegistry usersRegistry = UserRegistry(userRegistry);
        usersRegistry.addExtraUserAccount(_originalAddress, _extraUserAddress);
        return true;
    }
}
