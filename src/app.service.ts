import { Injectable } from '@nestjs/common';
import { NewUserDto } from './data_models/NewUser.dto';
import {SvandisDataDto} from './data_models/SvandisData.dto';

import {ContractsService} from './web3/ContractsService';

@Injectable()
export class AppService {
    constructor(private contractsService: ContractsService){}
    root(): string {
      return 'This is the Svandis Backend!';
    }
    createUser(createUserDto: NewUserDto): string {
        this.contractsService.createNewUser(createUserDto);
        return 'Create new user';
    }
    createCentralizedUser(createUserDto: NewUserDto): string {
        this.contractsService.createNewCentralizedUser(createUserDto);
        return 'Create new centralized user';
    }
    newTokenScreener(svandisDataDto: SvandisDataDto): string {
        this.contractsService.createNewTokenScreener(svandisDataDto);
        return 'Will create new token screener';
    }
    newIcoScreener(svandisDataDto: SvandisDataDto): string {
        this.contractsService.createNewIcoScreener(svandisDataDto);
        return 'Will create new token screener';
    }
    updateSvandisData(svandisDataDto: SvandisDataDto): string {
        this.contractsService.updateScreener(svandisDataDto);
        return 'Will update svandis data';
    }
    removeUser(createUserDto): string {
        this.contractsService.removeUser(createUserDto);
        return 'Will update svandis data';
    }
}
