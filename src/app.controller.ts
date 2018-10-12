import {Controller, Get, Post, Body, Req, Res, Param, ValidationPipe} from '@nestjs/common';
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

    @Post('create-centralized-user')
    async createCentralizedUser(@Body() newUserDto: NewUserDto) {
        return this.appService.createCentralizedUser(newUserDto);
    }

    @Post('create-token-screener')
    async createTokenScreener(@Body() svandisDataDto: SvandisDataDto) {
        return this.appService.newTokenScreener(svandisDataDto);
    }

    @Post('create-ico-screener')
    async createIcoScreener(@Body() svandisDataDto: SvandisDataDto) {
        return this.appService.newIcoScreener(svandisDataDto);
    }

    @Post('update-svandis-data')
    async updateSvandisData(@Body() svandisDataDto: SvandisDataDto) {
        return this.appService.updateSvandisData(svandisDataDto);
    }

    @Post('remove-user')
    async removeUser(@Body() svandisDataDto: SvandisDataDto) {
        return this.appService.updateSvandisData(svandisDataDto);
    }

}
