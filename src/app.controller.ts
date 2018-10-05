import { Controller, Get, Post, Body, Req, Res, Param } from '@nestjs/common';
import { AppService } from './app.service';
import {NewUserDto} from './data_models/NewUser.dto';
import {SvandisDataDto} from './data_models/SvandisData.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @Post('create-user')
    async createUser(@Body() newUserDto: NewUserDto) {
        return this.appService.createUser(newUserDto);
    }

    @Post('create-svandis-data')
    async createSvandisData(@Body() svandisDataDto: SvandisDataDto) {
        return this.appService.newSvandisData(svandisDataDto);
    }
    @Post('update-svandis-data')
    async updateSvandisData(@Body() svandisDataDto: SvandisDataDto) {
        return this.appService.updateSvandisData(svandisDataDto);
    }

}
