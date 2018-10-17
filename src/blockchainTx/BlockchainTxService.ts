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
        return 'Create new user';
    }
    createCentralizedUser(createUserDto: CentralizedBlockchainUserDto): string {
        this.contractsService.createNewCentralizedUser(createUserDto);
        return 'Create new centralized user';
    }
    newTokenScreener(svandisDataDto: NewTokenDto): string {
        this.contractsService.createNewTokenScreener(svandisDataDto);
        return 'Will create new token screener';
    }
    newIcoScreener(svandisDataDto: NewIcoDto): string {
        this.contractsService.createNewIcoScreener(svandisDataDto);
        return 'Will create new token screener';
    }
    updateSvandisData(updateScreener: UpdateScreenerDto): string {
        this.contractsService.updateScreener(updateScreener);
        return 'Will update svandis data';
    }
    removeUser(removeUserDto: UserRemovalDto): string {
        this.contractsService.removeUser(removeUserDto);
        return 'Will remove user';
    }
    swapCentralizedUserRecovery(swapRecoveryCentralized: SwapRecoveryCentralizedDto): string {
        this.contractsService.swapCentralizedUserRecovery(swapRecoveryCentralized);
        return 'Will swap centralized user';
    }
    addExtraKeyForSvandisCentralizedUserAccounts(addExtraRecovery: AddExtraRecoveryCentralizedDto): string {
        this.contractsService.addExtraKeyForSvandisCentralizedUserAccounts(addExtraRecovery);
        return 'Will add extra key to centralized accounts';
    }
}
