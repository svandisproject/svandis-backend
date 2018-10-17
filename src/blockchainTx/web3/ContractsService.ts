import * as Web3 from 'web3';
import * as HDWalletProvider from 'truffle-hdwallet-provider';
import * as config from '../../../test-config.json';
import * as RLP from 'rlp';
declare let require: any;
import * as EcosystemAbi from '../../../build/contracts/SvandisEcosystem.json';
import {Injectable} from '@nestjs/common';
import {NewIcoDto} from '../data_models/NewIcoDto';
import {BlockchainUserDto} from '../data_models/BlockchainUserDto';
import {NewTokenDto} from '../data_models/NewTokenDto';
import {CentralizedBlockchainUserDto} from '../data_models/CentralizedBlockchainUserDto';
import {UpdateScreenerDto} from '../data_models/UpdateScreenerDto';
import {UserRemovalDto} from '../data_models/UserRemovalDto';
import {SwapRecoveryCentralizedDto} from '../data_models/SwapRecoveryCentralizedDto';
import {AddExtraRecoveryCentralizedDto} from '../data_models/AddExtraRecoveryCentralizedDto';

@Injectable()
export class ContractsService {
    private web3: any;
    public account: any;
    private ecosystemContract: any;

    constructor() {
            const hd = new HDWalletProvider(config.mnemonic, config.rpc);
            this.web3 = new Web3(hd);
            this.ecosystemContract = new this.web3.eth.Contract(EcosystemAbi.abi, config.ecosystemAddress);
            this.ecosystemContract.setProvider(this.web3.currentProvider);
    }

    updateAccount(accountAddress: string){
        this.account = accountAddress;
    }

    public  createNewTokenScreener(svandisData: NewTokenDto) {
        const name = 'Svandis';
        const ticker = 'SVN';
        const website = 'https://svandis.io';
        const dataLoad = [0x76, 0x22, 0x2a];
        this.ecosystemContract.methods.createNewTokenScreener( name,
            this.web3.utils.asciiToHex(ticker),
            website,
            dataLoad).send({
            from: config.ownerAddress,
            gas: 1500000,
            gasPrice: '1'}).
        then(function(receipt){
            console.log(receipt.events.Created);
        });
    }

    public  createNewIcoScreener(svandisData: NewIcoDto) {
        const name = 'Svandis';
        const ticker = 'SVN';
        const website = 'https://svandis.io';
        const dataLoad = [0x76, 0x22, 0x2a];
        const tokenGenerationEventTimestamp = 1546300800;
        this.ecosystemContract.methods.createNewIcoScreener( name,
            this.web3.utils.asciiToHex(ticker),
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

    async createNewUser(newUser: BlockchainUserDto) {
        const data_text_1 = 'Verified Social';
        const data_text_2 = 'Verified Kyc';
        const dataHash_1 = Web3.utils.asciiToHex(data_text_1);
        const dataHash_2 = Web3.utils.asciiToHex(data_text_2);
        const predictAddress = await this.predictIdentityAddress(config.ecosystemAddress);
        const claimType_1 = 1;
        const hashed = this.web3.utils.soliditySha3(predictAddress, claimType_1, dataHash_1);
        const prvSigner1 = this.web3.utils.randomHex(32);
        const signed = await this.web3.eth.accounts.sign(hashed, prvSigner1);
        const claimType_2 = 2;
        const prvSigner2 = this.web3.utils.randomHex(32);
        const hashed2 = this.web3.utils.sha3(predictAddress, claimType_2, dataHash_2);
        const signed2 = await this.web3.eth.accounts.sign(hashed2, prvSigner2);

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
        this.ecosystemContract.methods.createNewUser(
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

    async createNewCentralizedUser(newUser: CentralizedBlockchainUserDto) {
        const data_text_1 = 'Verified Social';
        const data_text_2 = 'Verified Kyc';
        const dataHash_1 = Web3.utils.asciiToHex(data_text_1);
        const dataHash_2 = Web3.utils.asciiToHex(data_text_2);
        const predictAddress = await this.predictIdentityAddress(config.ecosystemAddress);
        const claimType_1 = 1;
        const hashed = this.web3.utils.soliditySha3(predictAddress, claimType_1, dataHash_1);
        const prvSigner1 = this.web3.utils.randomHex(32);
        const signed = await this.web3.eth.accounts.sign(hashed, prvSigner1);
        const claimType_2 = 2;
        const prvSigner2 = this.web3.utils.randomHex(32);
        const hashed2 = this.web3.utils.sha3(predictAddress, claimType_2, dataHash_2);
        const signed2 = await this.web3.eth.accounts.sign(hashed2, prvSigner2);

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
        this.ecosystemContract.methods.createNewCentralizedUser(
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
            this.web3.eth.getTransactionCount(wallet, (err, count) => {
                resolve(count);
            });
        });
        const address =
            '0x' + this.web3.utils.sha3(RLP.encode([wallet, nonce])).substring(26, 66);
        return address.toString();
    }

    public updateScreener(svandisData: UpdateScreenerDto) {
        const dataAddress = '0x0Ce2c1ef3bF5F41d20Af3e12071db1c4aF66d629';
        const newData = [0x67, 0x12, 0xff];
        const consensusUsers = [config.ownerAddress];
        const consensusUserNewRatings = [1];
        const metConsensus = [true];
        this.ecosystemContract.methods.updateSvandisData (dataAddress,
            newData,
            consensusUsers,
            consensusUserNewRatings,
            metConsensus).send({from: config.ownerAddress,
            gas: 3000000,
            gasPrice: '1'})
            .then(function(receipt){
                console.log(receipt);
            });
    }

    public removeUser(user: UserRemovalDto) {
        this.ecosystemContract.methods.removeUser (config.ownerAddress,
        ).send({from: config.ownerAddress,
            gas: 1000000,
            gasPrice: '1'})
            .then(function(receipt){
                console.log(receipt);
            });
    }

    public swapCentralizedUserRecovery(user: SwapRecoveryCentralizedDto) {
        this.ecosystemContract.methods.swapMainKeyForSvandisCentralizedUserAccounts (
            config.ownerAddress,
            config.ownerAddress).send({from: config.ownerAddress,
            gas: 2000000,
            gasPrice: '1'})
            .then(function(receipt){
                console.log(receipt);
            });
    }

    public addExtraKeyForSvandisCentralizedUserAccounts(user: AddExtraRecoveryCentralizedDto) {
        this.ecosystemContract.methods.addExtraKeyForSvandisCentralizedUserAccounts (
            config.ownerAddress,
            '0x281055afc982d96fab65b3a49cac8b878184cb16').send({from: config.ownerAddress,
            gas: 3000000,
            gasPrice: '1'})
            .then(function(receipt){
                console.log(receipt);
            });
    }
}