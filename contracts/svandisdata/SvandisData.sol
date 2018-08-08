pragma solidity ^0.4.23;


import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract SvandisData is Ownable{

    string public name;
    string public website;
    bytes32 public currentDataHash;
    uint public firstUpdated;
    uint public lastUpdated;

    constructor(string _name, string _website, bytes _dataLoad) public{
        name=_name;
        website = _website;
        currentDataHash = keccak256(_dataLoad);
        firstUpdated = now;
        lastUpdated = now;
    }

    function updateData(bytes _dataLoad) public onlyOwner returns (bool){
        currentDataHash = keccak256(_dataLoad);
        lastUpdated = now;
    }
}
