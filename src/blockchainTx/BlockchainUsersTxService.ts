import { Injectable } from '@nestjs/common';
import { BlockchainUserDto } from './data_models/BlockchainUserDto';
import {ContractsService} from './web3/ContractsService';
import {CentralizedBlockchainUserDto} from './data_models/CentralizedBlockchainUserDto';
import {UserRemovalDto} from './data_models/UserRemovalDto';
import {SwapRecoveryCentralizedDto} from './data_models/SwapRecoveryCentralizedDto';
import {AddExtraRecoveryCentralizedDto} from './data_models/AddExtraRecoveryCentralizedDto';
import axios from 'axios';
import {SvandisApi} from './config/SvandisApi';

@Injectable()
export class BlockchainUsersTxService {
    constructor(private contractsService: ContractsService){}

    createUser(createUserDto: BlockchainUserDto, request: any): string {
        if (this.isValidUser(request)) {
            this.contractsService.createNewUser(createUserDto);
            const data = {
                response: 'Created new blockchain user',
            };
            return JSON.stringify(data);
        }
        else{
            return 'Error, no user created';
        }
    }

    createCentralizedUser(createUserDto: CentralizedBlockchainUserDto, request: any): string {
        if (this.isValidUser(request)) {
            this.contractsService.createNewCentralizedUser(createUserDto);
            const data = {
                response: 'Created new centralized blockchain user',
            };
            return JSON.stringify(data);
        }
        else{
            return 'Error, no user created';
        }
    }

    removeUser(removeUserDto: UserRemovalDto, request: any): string {
        if (this.isValidUser(request)) {
            this.contractsService.removeUser(removeUserDto);
            const data = {
                response: 'Will remove user',
            };
            return JSON.stringify(data);
        }
        else{
            return 'Error, no user created';
        }
    }

    swapCentralizedUserRecovery(swapRecoveryCentralized: SwapRecoveryCentralizedDto, request: any): string {
            if (this.isValidUser(request)) {
                this.contractsService.swapCentralizedUserRecovery(swapRecoveryCentralized);
                const data = {
                    response: 'Will swap centralized user',
                };
                return JSON.stringify(data);
            }
            else{
                return 'Error, no user created';
            }
        }

    addExtraKeyForSvandisCentralizedUserAccounts(addExtraRecovery: AddExtraRecoveryCentralizedDto, request: any): string {
            if (this.isValidUser(request)) {
                this.contractsService.addExtraKeyForSvandisCentralizedUserAccounts(addExtraRecovery);
                const data = {
                    response: 'Will add extra key to centralized accounts',
                };
                return JSON.stringify(data);
            }
            else{
                return 'Error, no user created';
            }
    }

    isValidUser(request: any): boolean {
        const authJWT = request.headers.authorization;
        const URL = SvandisApi.API_URL +  '/user/check';
        console.log(authJWT);
        axios.get(URL, { headers: { Authorization: authJWT } }).then(response => {
            // If request is good...
            console.log('See response from Auth jwt call: ');
            console.log(response.data);
        })
            .catch((error) => {
                console.log('error ' + error);
            });
        return false;
    }
}
