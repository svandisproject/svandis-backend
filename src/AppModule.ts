import { Module } from '@nestjs/common';
import { AppController } from './AppController';
import { AppService } from './AppService';
import {BlockchainTxService} from './blockchainTx/BlockchainTxService';
import {BlockchainTxModule} from './blockchainTx/BlockchainTxModule';
import {ContractsService} from './blockchainTx/web3/ContractsService';

@Module({
  imports: [BlockchainTxModule],
  controllers: [AppController],
  providers: [AppService, BlockchainTxService, ContractsService],
    exports: [BlockchainTxModule],
})
export class AppModule {}
