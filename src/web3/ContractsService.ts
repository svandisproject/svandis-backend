import * as Web3 from 'web3';
import * as HDWalletProvider from 'truffle-hdwallet-provider';
import * as config from '../../test-config.json';

import * as contract from 'truffle-contract';
import * as RLP from 'rlp';

declare let require: any;
import * as EcosystemAbi from '../../build/contracts/SvandisEcosystem.json';
import {Injectable} from '@nestjs/common';
import {Observable, BehaviorSubject} from 'rxjs';
import {from} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import {SvandisDataDto} from '../data_models/SvandisData.dto';
import {NewUserDto} from '../data_models/NewUser.dto';

@Injectable()
export class ContractsService {
    private _web3: any;
    public _account: any;
    private _ecosystemContract: any;

    constructor() {
            const hd = new HDWalletProvider(config.mnemonic, config.rpc);
            this._web3 = new Web3(hd);
            this._ecosystemContract = new this._web3.eth.Contract(EcosystemAbi.abi, config.ecosystemAddress);
            this._ecosystemContract.setProvider(this._web3.currentProvider);
    }

    updateAccount(accountAddress: string){
        this._account = accountAddress;
    }

    public  createNewTokenScreener(svandisData: SvandisDataDto) {
        const name = 'Svandis';
        const ticker = 'SVN';
        const website = 'https://svandis.io';
        const dataLoad = [0x76, 0x22, 0x2a];
        this._ecosystemContract.methods.createNewTokenScreener( name,
            this._web3.utils.asciiToHex(ticker),
            website,
            dataLoad).send({
            from: config.ownerAddress,
            gas: 1500000,
            gasPrice: '1'}).
        then(function(receipt){
            console.log(receipt.events.Created);
        });
    }

    public  createNewIcoScreener(svandisData: SvandisDataDto) {
        const name = 'Svandis';
        const ticker = 'SVN';
        const website = 'https://svandis.io';
        const dataLoad = [0x76, 0x22, 0x2a];
        const tokenGenerationEventTimestamp = 1546300800;
        this._ecosystemContract.methods.createNewIcoScreener( name,
            this._web3.utils.asciiToHex(ticker),
            website,
            dataLoad,
            tokenGenerationEventTimestamp).send({
            from: config.ownerAddress,
            gas: 1500000,
            gasPrice: '1'}).
        then(function(receipt, result, err){
            console.log(receipt.events.Created);
        });
    }

    async createNewUser(newUser: NewUserDto) {
        const data_text_1 = 'Verified Social';
        const data_text_2 = 'Verified Kyc';
        const dataHash_1 = Web3.utils.asciiToHex(data_text_1);
        const dataHash_2 = Web3.utils.asciiToHex(data_text_2);
        const predictAddress = await this.predictIdentityAddress(config.ecosystemAddress);
        const claimType_1 = 1;
        const hashed = this._web3.utils.soliditySha3(predictAddress, claimType_1, dataHash_1);
        const prvSigner1 = this._web3.utils.randomHex(32);
        const signed = await this._web3.eth.accounts.sign(hashed, prvSigner1);
        const claimType_2 = 2;
        const prvSigner2 = this._web3.utils.randomHex(32);
        const hashed2 = this._web3.utils.sha3(predictAddress, claimType_2, dataHash_2);
        const signed2 = await this._web3.eth.accounts.sign(hashed2, prvSigner2);

        const attestation_1 = {
            claimType: claimType_1,
            scheme: 1,
            issuer: config.ownerAddress,
            signature: signed.signature,
            data: hashed,
            uri: '',
        };
        const attestation_2 = {
            claimType: claimType_2,
            scheme: 1,
            issuer:  config.ownerAddress,
            signature: signed2.signature,
            data: hashed2,
            uri: '',
        };
        this._ecosystemContract.methods.createNewUser(
            config.ownerAddress, config.ownerAddress,
            [ attestation_1.claimType, attestation_2.claimType ],
            [ attestation_1.issuer, attestation_2.issuer ],
            attestation_1.signature + attestation_2.signature.slice(2),
            attestation_1.data + attestation_2.data.slice(2),
            [32, 32]).send({from: config.ownerAddress,
            gas: 3000000,
            gasPrice: '1'})
            .then(function(receipt){
                console.log(receipt);
            });
    }

    async createNewCentralizedUser(newUser: NewUserDto) {
        const data_text_1 = 'Verified Social';
        const data_text_2 = 'Verified Kyc';
        const dataHash_1 = Web3.utils.asciiToHex(data_text_1);
        const dataHash_2 = Web3.utils.asciiToHex(data_text_2);
        const predictAddress = await this.predictIdentityAddress(config.ecosystemAddress);
        const claimType_1 = 1;
        const hashed = this._web3.utils.soliditySha3(predictAddress, claimType_1, dataHash_1);
        const prvSigner1 = this._web3.utils.randomHex(32);
        const signed = await this._web3.eth.accounts.sign(hashed, prvSigner1);
        const claimType_2 = 2;
        const prvSigner2 = this._web3.utils.randomHex(32);
        const hashed2 = this._web3.utils.sha3(predictAddress, claimType_2, dataHash_2);
        const signed2 = await this._web3.eth.accounts.sign(hashed2, prvSigner2);

        const attestation_1 = {
            claimType: claimType_1,
            scheme: 1,
            issuer: config.ownerAddress,
            signature: signed.signature,
            data: hashed,
            uri: '',
        };
        const attestation_2 = {
            claimType: claimType_2,
            scheme: 1,
            issuer:  config.ownerAddress,
            signature: signed2.signature,
            data: hashed2,
            uri: '',
        };
        this._ecosystemContract.methods.createNewCentralizedUser(
            config.ownerAddress,
            [ attestation_1.claimType, attestation_2.claimType ],
            [ attestation_1.issuer, attestation_2.issuer ],
            attestation_1.signature + attestation_2.signature.slice(2),
            attestation_1.data + attestation_2.data.slice(2),
            [32, 32]).send({from: config.ownerAddress,
            gas: 3000000,
            gasPrice: '1'})
            .then(function(receipt){
                console.log(receipt);
            });
    }

    async predictIdentityAddress(wallet) {
        const nonce = await new Promise(resolve => {
            this._web3.eth.getTransactionCount(wallet, (err, count) => {
                resolve(count);
            });
        });
        const address =
            '0x' + this._web3.utils.sha3(RLP.encode([wallet, nonce])).substring(26, 66);
        return address.toString();
    }

    public updateScreener(svandisData: SvandisDataDto) {
        const _dataAddress = '0x0Ce2c1ef3bF5F41d20Af3e12071db1c4aF66d629';
        const _newData = [0x67, 0x12, 0xff];
        const _consensusUsers = [config.ownerAddress];
        const _consensusUserNewRatings = [1];
        const _metConsensus = [true];
        this._ecosystemContract.methods.updateSvandisData (_dataAddress,
            _newData,
            _consensusUsers,
            _consensusUserNewRatings,
            _metConsensus).send({from: config.ownerAddress,
            gas: 3000000,
            gasPrice: '1'})
            .then(function(receipt){
                console.log(receipt);
            });
    }

    public removeUser(user: NewUserDto) {
        this._ecosystemContract.methods.removeUser (config.ownerAddress,
        ).send({from: config.ownerAddress,
            gas: 1000000,
            gasPrice: '1'})
            .then(function(receipt){
                console.log(receipt);
            });
    }

    public swapCentralizedUserRecovery(user: NewUserDto) {
        this._ecosystemContract.methods.swapMainKeyForSvandisCentralizedUserAccounts (
            config.ownerAddress,
            config.ownerAddress).send({from: config.ownerAddress,
            gas: 2000000,
            gasPrice: '1'})
            .then(function(receipt){
                console.log(receipt);
            });
    }

    public addExtraKeyForSvandisCentralizedUserAccounts(user: NewUserDto) {
        this._ecosystemContract.methods.addExtraKeyForSvandisCentralizedUserAccounts (
            config.ownerAddress,
            config.ecosystemAddress).send({from: config.ownerAddress,
            gas: 3000000,
            gasPrice: '1'})
            .then(function(receipt){
                console.log(receipt);
            });
    }
}