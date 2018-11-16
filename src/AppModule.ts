import {Module} from '@nestjs/common';
import { AppController } from './AppController';
import {BlockchainTxModule} from './blockchainTx/BlockchainTxModule';

@Module({
  imports: [BlockchainTxModule],
  controllers: [AppController],
  providers: [],
    exports: [BlockchainTxModule],
})
export class AppModule {}
