import {Controller, Get, Post, Body, Req, Res, Param, ValidationPipe} from '@nestjs/common';
import { BlockchainUsersTxService } from './BlockchainUsersTxService';
import {BlockchainUserDto} from './data_models/BlockchainUserDto';
import {CentralizedBlockchainUserDto} from './data_models/CentralizedBlockchainUserDto';
import {UserRemovalDto} from './data_models/UserRemovalDto';
import {SwapRecoveryCentralizedDto} from './data_models/SwapRecoveryCentralizedDto';
import {AddExtraRecoveryCentralizedDto} from './data_models/AddExtraRecoveryCentralizedDto';

@Controller()
export class BlockchainUsersTxController {
  constructor(private readonly appService: BlockchainUsersTxService) {}

    @Post('blockchain-user')
    async createBlockchainUser(@Body() newUserDto: BlockchainUserDto) {
        return this.appService.createUser(newUserDto);
    }

    @Post('blockchain-centralized-user')
    async createBlockchainCentralizedUser(@Body() newUserDto: CentralizedBlockchainUserDto) {
        return this.appService.createCentralizedUser(newUserDto);
    }

    @Post('remove-user')
    async removeUser(@Body() svandisDataDto: UserRemovalDto) {
        return this.appService.removeUser(svandisDataDto);
    }

    @Post('swap-centralized-recovery')
    async swapCentralizedRecoveryMethod(@Body() swapRecovery: SwapRecoveryCentralizedDto) {
        return this.appService.swapCentralizedUserRecovery(swapRecovery);
    }

    @Post('add-new-recovery')
    async addExtraKeyForSvandisCentralizedUserAccounts(@Body() addExtraRecovery: AddExtraRecoveryCentralizedDto) {
        return this.appService.addExtraKeyForSvandisCentralizedUserAccounts(addExtraRecovery);
    }
}
