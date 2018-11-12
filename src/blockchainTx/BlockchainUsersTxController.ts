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
    async createBlockchainUser(@Body() newUserDto: BlockchainUserDto, @Req() request: any) {
        return this.appService.createUser(newUserDto, request);
    }

    @Post('blockchain-centralized-user')
    async createBlockchainCentralizedUser(@Body() newUserDto: CentralizedBlockchainUserDto, @Req() request: any) {
        return this.appService.createCentralizedUser(newUserDto, request);
    }

    @Post('remove-user')
    async removeUser(@Body() svandisDataDto: UserRemovalDto, @Req() request: any) {
        return this.appService.removeUser(svandisDataDto, request);
    }

    @Post('swap-centralized-recovery')
    async swapCentralizedRecoveryMethod(@Body() swapRecovery: SwapRecoveryCentralizedDto, @Req() request: any) {
        return this.appService.swapCentralizedUserRecovery(swapRecovery, request);
    }

    @Post('add-new-recovery')
    async addExtraKeyForSvandisCentralizedUserAccounts(@Body() addExtraRecovery: AddExtraRecoveryCentralizedDto, @Req() request: any) {
        return this.appService.addExtraKeyForSvandisCentralizedUserAccounts(addExtraRecovery, request);
    }
}
