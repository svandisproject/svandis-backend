import { Injectable } from '@nestjs/common';
import { BlockchainUserDto } from './data_models/BlockchainUserDto';
import {NewIcoDto} from './data_models/NewIcoDto';

import {ContractsService} from './web3/ContractsService';
import {CentralizedBlockchainUserDto} from './data_models/CentralizedBlockchainUserDto';
import {NewTokenDto} from './data_models/NewTokenDto';
import {UpdateScreenerDto} from './data_models/UpdateScreenerDto';
import {UserRemovalDto} from './data_models/UserRemovalDto';
import {SwapRecoveryCentralizedDto} from './data_models/SwapRecoveryCentralizedDto';
import {AddExtraRecoveryCentralizedDto} from './data_models/AddExtraRecoveryCentralizedDto';

@Injectable()
export class BlockchainTxService {
    constructor(private contractsService: ContractsService){}
    root(): string {
      return 'This is the Svandis Backend!';
    }
    createUser(createUserDto: BlockchainUserDto): string {
        this.contractsService.createNewUser(createUserDto);
        const data = {
            response: 'Created new blockchain user',
        };
        return JSON.stringify(data);
    }
    createCentralizedUser(createUserDto: CentralizedBlockchainUserDto): string {
        this.contractsService.createNewCentralizedUser(createUserDto);
        const data = {
            response: 'Created new centralized blockchain user',
        };
        return JSON.stringify(data);
    }
    newTokenScreener(svandisDataDto: NewTokenDto): string {
        this.contractsService.createNewTokenScreener(svandisDataDto);
        const data = {
            response: 'Will create new token screener',
        };
        return JSON.stringify(data);
    }
    newIcoScreener(svandisDataDto: NewIcoDto): string {
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
    removeUser(removeUserDto: UserRemovalDto): string {
        this.contractsService.removeUser(removeUserDto);
        const data = {
            response: 'Will remove user',
        };
        return JSON.stringify(data);
    }
    swapCentralizedUserRecovery(swapRecoveryCentralized: SwapRecoveryCentralizedDto): string {
        this.contractsService.swapCentralizedUserRecovery(swapRecoveryCentralized);
        const data = {
            response: 'Will swap centralized user',
        };
        return JSON.stringify(data);
    }
    addExtraKeyForSvandisCentralizedUserAccounts(addExtraRecovery: AddExtraRecoveryCentralizedDto): string {
        this.contractsService.addExtraKeyForSvandisCentralizedUserAccounts(addExtraRecovery);
        const data = {
            response: 'Will add extra key to centralized accounts',
        };
        return JSON.stringify(data);
    }
}
