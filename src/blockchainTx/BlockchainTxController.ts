import {Controller, Get, Post, Body, Req, Res, Param, ValidationPipe} from '@nestjs/common';
import { BlockchainTxService } from './BlockchainTxService';
import {BlockchainUserDto} from './data_models/BlockchainUserDto';
import {NewIcoDto} from './data_models/NewIcoDto';
import {CentralizedBlockchainUserDto} from './data_models/CentralizedBlockchainUserDto';
import {NewTokenDto} from './data_models/NewTokenDto';
import {UpdateScreenerDto} from './data_models/UpdateScreenerDto';
import {UserRemovalDto} from './data_models/UserRemovalDto';
import {SwapRecoveryCentralizedDto} from './data_models/SwapRecoveryCentralizedDto';
import {AddExtraRecoveryCentralizedDto} from './data_models/AddExtraRecoveryCentralizedDto';

@Controller()
export class BlockchainTxController {
  constructor(private readonly appService: BlockchainTxService) {}

    @Post('create-user')
    async createUser(@Body() newUserDto: BlockchainUserDto) {
        return this.appService.createUser(newUserDto);
    }

    @Post('create-centralized-user')
    async createCentralizedUser(@Body() newUserDto: CentralizedBlockchainUserDto) {
        return this.appService.createCentralizedUser(newUserDto);
    }

    @Post('create-token-screener')
    async createTokenScreener(@Body() svandisDataDto: NewTokenDto) {
        return this.appService.newTokenScreener(svandisDataDto);
    }

    @Post('create-ico-screener')
    async createIcoScreener(@Body() svandisDataDto: NewIcoDto) {
        return this.appService.newIcoScreener(svandisDataDto);
    }

    @Post('update-svandis-data')
    async updateSvandisData(@Body() svandisDataDto: UpdateScreenerDto) {
        return this.appService.updateSvandisData(svandisDataDto);
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
