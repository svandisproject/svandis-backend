import {Controller, Get, Post, Body, Req, Res, Param, ValidationPipe} from '@nestjs/common';
import {NewIcoDto} from './data_models/NewIcoDto';
import {NewTokenDto} from './data_models/NewTokenDto';
import {UpdateScreenerDto} from './data_models/UpdateScreenerDto';
import {BlockchainScreenersTxService} from './BlockchainScreenersTxService';

@Controller()
export class BlockchainScreenersTxController {
  constructor(private readonly appService: BlockchainScreenersTxService) {}

    @Post('token-screener')
    async createTokenScreener(@Body() svandisDataDto: NewTokenDto) {
        return this.appService.createTokenScreener(svandisDataDto);
    }

    @Post('ico-screener')
    async createIcoScreener(@Body() svandisDataDto: NewIcoDto) {
        return this.appService.createIcoScreener(svandisDataDto);
    }

    @Post('update-svandis-data')
    async updateSvandisData(@Body() svandisDataDto: UpdateScreenerDto) {
        return this.appService.updateSvandisData(svandisDataDto);
    }
}
