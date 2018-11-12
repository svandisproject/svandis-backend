## Description

This project is a server component based on the [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

It comprises of smart contracts created by the Svandis organization with the purpose of creating more transparency in the blockchain industry.

### Identity

Within this project is an implementation of ERC 725/735 Identity Standards. These contracts reference the [Origin.js](https://github.com/OriginProtocol/origin-js) project standards for meeting the requirements of the EIP, and have been modified to meet the needs of offloading all gas costs onto the Svandis organization on behalf of it's decentralized research community. Svandis will act as an optional trusted partner for beginners as key management, and expert users will be able to take full control of their on chain identity.

### Data Signing

The purpose for this backend project is for collecting signed pieces of data from users meeting consensus with eachother, and submitting these signed data hashed as public proof that a member of the research community attested to a change in the Svandis database. In such, each time a screener for instance is changed in the database due to a consensus between users, the state of the database will be reflected onto the blockchain with their signatures confirming these decentralized attestations. As Svandis and Blockchain technology evolves, this process will move further onto the blockchain. For the time being, Svandis is responsible for providing random consensus and publically sharing the signed data hashes created by the research community as they curate the screeners.

## Installation

This project will need the latest Node.js set up on the machine. You should also have ganache installed. After cloning the project run:

  `npm install`

##Smart Contract Building and Testing

```truffle compile```

Compile Smart Contracts

```truffle test```

Run Truffle Javascript Tests

```truffle migrate```

Use other networks with truffle migrate (Remember to configure networks in truffle.js)

```truffle migrate --network <network name, ie kovan>```

Deploy the files to your configured RPC connection with truffle migrate. This is necessary to use the API with calls to smart contracts.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# incremental rebuild (webpack)
$ npm run webpack
$ npm run start:hmr

# production mode
$ npm run start:prod
```

## Nest js Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```