# svandis-backend
Backend Blockchain Smart Contracts

This project is in development. It contains smart contracts needed to administer a Token Screener submission system, with rating on an identity contract. It is decentralized first, but is modified for Svandis to act as a recovery wallet and claim submitter for beginner users. As this project conforms with EIP 725 and 735, the user will be in full control of their key and therefore their data. The claims that are to be added to users identities will be KYC and social media claim related at first.

### Installation

This project will need the latest Node.js set up on the machine. You should also have ganache installed. After cloning the project run:

  `npm install`

### Compilation

To compile these smart contracts in truffle (Check truffle.js for your deployment options) :

  `truffle develop`

  `truffle compile`

### Migration

To migrate these smart contracts in truffle (modify truffle.js for migration setup):

  `truffle migrate`


### Tests

To run any javascript tests attached to this repository: 

  `truffle test`
  
 ### Credits
 
For identity management EIP 725 and 735, we chose to take an approach similar to the Origin Js Protocol Projet. This was modified to meet the needs of a centralized key management and decentralized expert options.


