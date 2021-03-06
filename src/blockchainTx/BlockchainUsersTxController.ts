import {Controller, Get, Post, Body, Req, Res, Param, ValidationPipe} from '@nestjs/common';
import {BlockchainUsersTxService} from './BlockchainUsersTxService';
import {BlockchainUserDto} from './data_models/BlockchainUserDto';
import {CentralizedBlockchainUserDto} from './data_models/CentralizedBlockchainUserDto';
import {UserRemovalDto} from './data_models/UserRemovalDto';
import {SwapRecoveryCentralizedDto} from './data_models/SwapRecoveryCentralizedDto';
import {AddExtraKeyCentralizedDto} from './data_models/AddExtraKeyCentralizedDto';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ConvertBeginnerToExpertDto} from './data_models/ConvertBeginnerToExpertDto';
import {Request} from 'express';

@Controller()
export class BlockchainUsersTxController {
    constructor(private readonly appService: BlockchainUsersTxService) {
    }

    @Post('blockchain-user')
    createBlockchainUser(@Body() newUserDto: BlockchainUserDto, @Req() request: Request): Observable<{ message: string }> {
        return this.appService.createUser(newUserDto, request)
            .pipe(
                map((res) => {
                    return {message: res};
                }));
    }

    @Post('blockchain-centralized-user')
    createBlockchainCentralizedUser(@Body() newUserDto: CentralizedBlockchainUserDto, @Req() request: Request): Observable<{ message: string }> {
        return this.appService.createCentralizedUser(newUserDto, request)
            .pipe(
                map((res) => {
                    return {message: res};
                }));
    }

    @Post('remove-user')
    removeUser(@Body() svandisDataDto: UserRemovalDto, @Req() request: Request): Observable<{ message: string }> {
        return this.appService.removeUser(svandisDataDto, request)
            .pipe(
                map((res) => {
                    return {message: res};
                }));
    }

    @Post('swap-centralized-recovery')
    swapCentralizedRecoveryMethod(@Body() swapRecovery: SwapRecoveryCentralizedDto, @Req() request: Request): Observable<{ message: string }> {
        return this.appService.swapCentralizedUserRecovery(swapRecovery, request)
            .pipe(
                map((res) => {
                    return {message: res};
                }));
    }

    @Post('add-new-recovery')
    addExtraKeyForSvandisCentralizedUserAccounts(@Body() addExtraRecovery: AddExtraKeyCentralizedDto,
                                                 @Req() request: Request): Observable<{ message: string }> {
        return this.appService.addExtraKeyForSvandisCentralizedUserAccounts(addExtraRecovery, request)
            .pipe(
                map((res) => {
                    return {message: res};
                }));
    }

    @Post('convert-beginner')
    convertBeginnerAccount(@Body() convertBeginner: ConvertBeginnerToExpertDto,
                           @Req() request: Request): Observable<{ message: string }> {
        return this.appService.convertBeginnerToExpertAccounts(convertBeginner, request)
            .pipe(
                map((res) => {
                    return {message: res};
                }));
    }
}
