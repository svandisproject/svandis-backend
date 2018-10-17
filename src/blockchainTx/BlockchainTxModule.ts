import { Global, Module } from '@nestjs/common';
import { BlockchainTxController } from './BlockchainTxController';
import { BlockchainTxService } from './BlockchainTxService';
import {ContractsService} from './web3/ContractsService';

@Global()
@Module({
  imports: [],
  controllers: [BlockchainTxController],
  providers: [BlockchainTxService, ContractsService],
})
export class BlockchainTxModule {}
