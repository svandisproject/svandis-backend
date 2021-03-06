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
import {AddExtraKeyCentralizedDto} from '../data_models/AddExtraKeyCentralizedDto';
import {ConvertBeginnerToExpertDto} from '../data_models/ConvertBeginnerToExpertDto';
import {UserHttpService} from '../UserHttpService';
import {Request} from 'express';

@Injectable()
export class ContractsService {
    private web3: any;
    public account: any;
    private ecosystemContract: any;
    private readonly SIGN_NEW_USER = 'CREATE NEW ACCOUNT';
    private readonly SIGN_DECENTRALIZATION = 'CONVERT DECENTRALIZED';
    private readonly SIGN_NEW_DEVICE = 'SIGN NEW DEVICE';
    private readonly SIGN_SWAP_DEVICE = 'SWAP NEW DEVICE';

    constructor(private userHttpService: UserHttpService) {
        const hd = new HDWalletProvider(config.mnemonic, config.rpc);
        this.web3 = new Web3(hd);
        this.ecosystemContract = new this.web3.eth.Contract(EcosystemAbi.abi, config.ecosystemAddress);
        this.ecosystemContract.setProvider(this.web3.currentProvider);
    }

    public  createNewTokenScreener(svandisData: NewTokenDto) {
        const name = svandisData.projectName;
        const ticker = svandisData.ticker;
        const website = svandisData.projectWebsite;
        const dataLoad = svandisData.dataLoad; // [0x76, 0x22, 0x2a];
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
        const name = svandisData.projectName;
        const ticker = svandisData.ticker;
        const website = svandisData.projectWebsite;
        const dataLoad = svandisData.dataLoad;
        const tokenGenerationEventTimestamp = svandisData.unixTokenGenerationTimestamp;
        this.ecosystemContract.methods.createNewIcoScreener(name,
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

    async createNewUser(newUser: BlockchainUserDto, request: Request) {
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
            this.web3.eth.accounts.recover(this.SIGN_NEW_USER, newUser.userAddressSignature), newUser.recoveryAddress,
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
        this.userHttpService.getCurrentUser(request).subscribe(userIndex => {
            const userArray = {
                onboarded : true,
                centralized : false,
                identity_address : predictAddress,
                key_addresses: [this.web3.eth.accounts.recover(this.SIGN_NEW_USER, newUser.userAddressSignature)],
                recovery_addresses: [newUser.recoveryAddress]};
            const myObject = {user: userArray};
            this.userHttpService.putCurrentUser(request, JSON.stringify(myObject), userIndex.id).subscribe(response => console.log(response));
        });
    }

    async createNewCentralizedUser(newUser: CentralizedBlockchainUserDto, request: Request) {
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
            this.web3.eth.accounts.recover(this.SIGN_NEW_USER, newUser.userAddressSignature),
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

        this.userHttpService.getCurrentUser(request).subscribe(userIndex => {
            const userArray = {
                onboarded : true,
                centralized : true,
                identity_address : predictAddress,
                key_addresses: [this.web3.eth.accounts.recover(this.SIGN_NEW_USER, newUser.userAddressSignature)],
                recovery_addresses: [config.ecosystemAddress]};
            const myObject = {user: userArray};
            this.userHttpService.putCurrentUser(request, JSON.stringify(myObject), userIndex.id).subscribe(response => console.log(response));
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
        const dataAddress = svandisData.dataAddress;
        const newData = svandisData.newDataLoad;
        const consensusUsers = [config.ownerAddress];
        const consensusUserNewRatings = [1];
        const metConsensus = [true];
        this.ecosystemContract.methods.updateSvandisData(dataAddress,
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

    public removeUser(user: UserRemovalDto, request: Request) {
        this.ecosystemContract.methods.removeUser(
            user.userAddressForRemoval).send({from: config.ownerAddress,
            gas: 1000000,
            gasPrice: '1'})
            .then(function(receipt){
                console.log(receipt);
            });
        this.userHttpService.getCurrentUser(request).subscribe(userIndex => {
            const userArray = {
                onboarded : false,
                centralized : true,
                identity_address : '',
                key_addresses: '',
                recovery_addresses: ''};
            const myObject = {user: userArray};
            this.userHttpService.putCurrentUser(request, JSON.stringify(myObject), userIndex.id).subscribe(response => console.log(response));
        });
    }

    public swapCentralizedUserRecovery(user: SwapRecoveryCentralizedDto, request: Request) {
        this.ecosystemContract.methods.swapMainKeyForSvandisCentralizedUserAccounts(
            user.currentAddress,
            user.newAddress).send({from: config.ownerAddress,
            gas: 2000000,
            gasPrice: '1'})
            .then(function(receipt){
                console.log(receipt);
            });
        this.userHttpService.getCurrentUser(request).subscribe(userIndex => {
            const userArray = {
                key_addresses: [this.web3.eth.accounts.recover(this.SIGN_SWAP_DEVICE, user.newAddress)]};
            const myObject = {user: userArray};
            this.userHttpService.putCurrentUser(request, JSON.stringify(myObject), userIndex.id).subscribe(response => console.log(response));
        });
    }

    public addExtraKeyForSvandisCentralizedUserAccounts(user: AddExtraKeyCentralizedDto, request: Request) {
        this.ecosystemContract.methods.addExtraKeyForSvandisCentralizedUserAccounts(
            user.currentAddress, user.newKeyAddress).send({from: config.ownerAddress,
            gas: 3000000,
            gasPrice: '1'})
            .then(function(receipt){
                console.log(receipt);
            });
        this.userHttpService.getCurrentUser(request).subscribe(userIndex => {
            const addresses = userIndex.key_addresses;
            addresses.push(this.web3.eth.accounts.recover(this.SIGN_NEW_DEVICE, user.newKeyAddress));
            const userArray = {
                key_addresses: addresses};
            const myObject = {user: userArray};
            this.userHttpService.putCurrentUser(request, JSON.stringify(myObject), userIndex.id).subscribe(response => console.log(response));
        });
    }

    public convertBeginnerToExpert(user: ConvertBeginnerToExpertDto, request: Request) {
        this.ecosystemContract.methods.swapSvandisKeyForRecoveryConvertCentralizedUserAccounts(
            this.web3.eth.accounts.recover(this.SIGN_DECENTRALIZATION, user.currentAddress), user.newRecoveryAddress).send({from: config.ownerAddress,
            gas: 3000000,
            gasPrice: '1'})
            .then(function(receipt){
                console.log(receipt);
            });
        this.userHttpService.getCurrentUser(request).subscribe(userIndex => {
            const userArray = {
                recovery_addresses: [user.newRecoveryAddress]};
            const myObject = {user: userArray};
            this.userHttpService.putCurrentUser(request, JSON.stringify(myObject), userIndex.id).subscribe(response => console.log(response));
        });
    }
}