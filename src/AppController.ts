import {Controller, Get, Post, Body, Req, Res, Param, ValidationPipe} from '@nestjs/common';
import { AppService } from './AppService';
import {BlockchainUserDto} from './blockchainTx/data_models/BlockchainUserDto';
import {NewIcoDto} from './blockchainTx/data_models/NewIcoDto';
import {BlockchainTxService} from './blockchainTx/BlockchainTxService';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, blockchainTx: BlockchainTxService) {}
}
