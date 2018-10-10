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


    public  createNewTokenScreener() {
        const name = 'Svandis';
        const ticker = 'SVN';
        const website = 'https://svandis.io';
        const dataLoad = [0x76, 0x22, 0x2a];
        this._ecosystemContract.methods.createNewTokenScreener( name,
                                      this._web3.utils.asciiToHex(ticker),
                                      website,
                                     dataLoad).send({from: config.ownerAddress}).then(function(receipt){
                                    console.log(receipt);
                                     });
    }

    async createNewUser() {
        const signature_1 =
            '0xeb6123e537e17e2c67b67bbc0b93e6b25ea9eae276c4c2ab353bd7e853ebad2446cc7e91327f3737559d7a9a90fc88529a6b72b770a612f808ab0ba57a46866e1c';
        const signature_2 =
            '0x061ef9cdd7707d90d7a7d95b53ddbd94905cb05dfe4734f97744c7976f2776145fef298fd0e31afa43a103cd7f5b00e3b226b0d62e4c492d54bec02eb0c2a0901b';

        const dataHash_1 = '0x4f32f7a7d40b4d65a917926cbfd8fd521483e7472bcc4d024179735622447dc9';
        const dataHash_2 = '0xa183d4eb3552e730c2dd3df91384426eb88879869b890ad12698320d8b88cb48';
        const dataString = 'CREATE NEW ACCOUNT';
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
            issuer: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
            signature: signed.signature,
            data: hashed,
            uri: '',
        };
        const attestation_2 = {
            claimType: claimType_2,
            scheme: 1,
            issuer:  '0x627306090abab3a6e1400e9345bc60c78a8bef57',
            signature: signed2.signature,
            data: hashed2,
            uri: '',
        };
        this._ecosystemContract.methods.createNewCentralizedUser(
                '0x796c22dd390f348f9dF985aFd6154c7135Eda37f',
                [ attestation_1.claimType, attestation_2.claimType ],
                [ attestation_1.issuer, attestation_2.issuer ],
                attestation_1.signature + attestation_2.signature.slice(2),
                attestation_1.data + attestation_2.data.slice(2),
                [32, 32]).send({from: config.ownerAddress})
                .then(function(receipt){
                });
    }
}