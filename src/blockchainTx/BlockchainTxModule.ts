import { Global, Module } from '@nestjs/common';
import { BlockchainUsersTxController } from './BlockchainUsersTxController';
import { BlockchainScreenersTxController } from './BlockchainScreenersTxController';
import { BlockchainUsersTxService } from './BlockchainUsersTxService';
import {ContractsService} from './web3/ContractsService';
import {BlockchainScreenersTxService} from './BlockchainScreenersTxService';

@Global()
@Module({
  imports: [],
  controllers: [BlockchainUsersTxController, BlockchainScreenersTxController],
  providers: [BlockchainUsersTxService, BlockchainScreenersTxService, ContractsService],
})
export class BlockchainTxModule {}
