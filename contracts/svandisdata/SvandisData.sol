pragma solidity ^0.4.23;


import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract SvandisData is Ownable{

    string public name;
    string public website;
    bytes32 public currentDataHash;
    uint public firstUpdated;
    uint public lastUpdated;

    constructor(address _owner, string memory _name, string memory _website, bytes memory _dataLoad) public{
        name=_name;
        website = _website;
        currentDataHash = keccak256(_dataLoad);
        firstUpdated = now;
        lastUpdated = now;
        owner = _owner;
    }

    function updateData(bytes memory _dataLoad) public onlyOwner returns (bool){
        currentDataHash = keccak256(_dataLoad);
        lastUpdated = now;
        return true;
    }
}
