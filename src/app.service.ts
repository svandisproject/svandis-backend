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
        this.contractsService.createNewUser();
        return 'Create new user';
    }
    newSvandisData(createUserDto: SvandisDataDto): string {
        this.contractsService.createNewTokenScreener();
        return 'Will create new svandis data';
    }
    updateSvandisData(svandisDataDto: SvandisDataDto): string {
        return 'Will update svandis data';
    }
}
