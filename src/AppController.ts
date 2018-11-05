import {Controller, Get, Post, Body, Req, Res, Param, ValidationPipe} from '@nestjs/common';
import {BlockchainUserDto} from './blockchainTx/data_models/BlockchainUserDto';
import {NewIcoDto} from './blockchainTx/data_models/NewIcoDto';
import {BlockchainUsersTxService} from './blockchainTx/BlockchainUsersTxService';

@Controller()
export class AppController {
  constructor() {}
}
