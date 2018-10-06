import * as Web3 from 'web3';

declare let require: any;

import * as EcosystemAbi from '../../build/contracts/SvandisEcosystem.json';
import {Injectable} from '@nestjs/common';
@Injectable()
export class ContractsService {
    private _web3: any;

    private _ecosystemContract: any;
    private _ecosystemContractAddress: string = '0x000';

    constructor() {
            this._web3 = new Web3('http://localhost:9545');
            this._ecosystemContract = this._web3.eth.contract(EcosystemAbi).at(this._ecosystemContract);
    }
}