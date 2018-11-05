import { Injectable } from '@nestjs/common';
import { BlockchainUserDto } from './data_models/BlockchainUserDto';
import {ContractsService} from './web3/ContractsService';
import {CentralizedBlockchainUserDto} from './data_models/CentralizedBlockchainUserDto';
import {UserRemovalDto} from './data_models/UserRemovalDto';
import {SwapRecoveryCentralizedDto} from './data_models/SwapRecoveryCentralizedDto';
import {AddExtraRecoveryCentralizedDto} from './data_models/AddExtraRecoveryCentralizedDto';

@Injectable()
export class BlockchainUsersTxService {
    constructor(private contractsService: ContractsService){}

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
