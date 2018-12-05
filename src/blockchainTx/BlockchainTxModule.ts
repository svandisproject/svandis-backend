import {Global, HttpModule, Module} from '@nestjs/common';
import { BlockchainUsersTxController } from './BlockchainUsersTxController';
import { BlockchainScreenersTxController } from './BlockchainScreenersTxController';
import { BlockchainUsersTxService } from './BlockchainUsersTxService';
import {ContractsService} from './web3/ContractsService';
import {BlockchainScreenersTxService} from './BlockchainScreenersTxService';
import {UserHttpService} from './UserHttpService';


@Global()
@Module({
  imports: [HttpModule],
  controllers: [BlockchainUsersTxController, BlockchainScreenersTxController],
  providers: [BlockchainUsersTxService, BlockchainScreenersTxService, ContractsService, UserHttpService],
})
export class BlockchainTxModule {}
