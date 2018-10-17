import {Controller, Get, Post, Body, Req, Res, Param, ValidationPipe} from '@nestjs/common';
import { AppService } from './AppService';
import {NewUserDto} from './blockchainTx/data_models/NewUser.dto';
import {SvandisDataDto} from './blockchainTx/data_models/SvandisData.dto';
import {BlockchainTxService} from './blockchainTx/BlockchainTxService';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, blockchainTx: BlockchainTxService) {}
}
