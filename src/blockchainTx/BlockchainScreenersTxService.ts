import { Injectable } from '@nestjs/common';
import {NewIcoDto} from './data_models/NewIcoDto';

import {ContractsService} from './web3/ContractsService';
import {NewTokenDto} from './data_models/NewTokenDto';
import {UpdateScreenerDto} from './data_models/UpdateScreenerDto';

@Injectable()
export class BlockchainScreenersTxService {
    constructor(private contractsService: ContractsService){}

    createTokenScreener(svandisDataDto: NewTokenDto): string {
        this.contractsService.createNewTokenScreener(svandisDataDto);
        const data = {
            response: 'Will create new token screener',
        };
        return JSON.stringify(data);
    }

    createIcoScreener(svandisDataDto: NewIcoDto): string {
        this.contractsService.createNewIcoScreener(svandisDataDto);
        const data = {
            response: 'Will create new token screener',
        };
        return JSON.stringify(data);
    }

    updateSvandisData(updateScreener: UpdateScreenerDto): string {
        this.contractsService.updateScreener(updateScreener);
        const data = {
            response: 'Will update svandis data',
        };
        return JSON.stringify(data);
    }
}
