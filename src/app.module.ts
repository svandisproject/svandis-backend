import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ContractsService} from './web3/ContractsService';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ContractsService],
})
export class AppModule {}
