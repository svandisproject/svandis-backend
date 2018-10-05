import { Injectable } from '@nestjs/common';
import { NewUserDto } from './data_models/NewUser.dto';
import {SvandisDataDto} from './data_models/SvandisData.dto';

@Injectable()
export class AppService {
  root(): string {
    return 'This is the Svandis Backend!';
  }
    createUser(createUserDto: NewUserDto): string {
        return 'Will create new user';
    }
    newSvandisData(createUserDto: SvandisDataDto): string {
        return 'Will create new svandis data';
    }
    updateSvandisData(svandisDataDto: SvandisDataDto): string {
        return 'Will update svandis data';
    }
}
