import { Module } from '@nestjs/common';
import { AppController } from './AppController';
import {BlockchainUsersTxService} from './blockchainTx/BlockchainUsersTxService';
import {BlockchainTxModule} from './blockchainTx/BlockchainTxModule';
import {ContractsService} from './blockchainTx/web3/ContractsService';
import {BlockchainScreenersTxService} from './blockchainTx/BlockchainScreenersTxService';

@Module({
  imports: [BlockchainTxModule],
  controllers: [AppController],
  providers: [BlockchainUsersTxService, BlockchainScreenersTxService, ContractsService],
    exports: [BlockchainTxModule],
})
export class AppModule {}
