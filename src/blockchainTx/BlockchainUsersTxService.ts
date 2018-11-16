import {HttpService, Injectable} from '@nestjs/common';
import {BlockchainUserDto} from './data_models/BlockchainUserDto';
import {ContractsService} from './web3/ContractsService';
import {CentralizedBlockchainUserDto} from './data_models/CentralizedBlockchainUserDto';
import {UserRemovalDto} from './data_models/UserRemovalDto';
import {SwapRecoveryCentralizedDto} from './data_models/SwapRecoveryCentralizedDto';
import {AddExtraRecoveryCentralizedDto} from './data_models/AddExtraRecoveryCentralizedDto';
import {SvandisApi} from './config/SvandisApi';
import {Observable} from 'rxjs';
import {AxiosResponse} from 'axios';
import {map} from 'rxjs/operators';

@Injectable()
export class BlockchainUsersTxService {
    constructor(private contractsService: ContractsService, private httpService: HttpService) {
    }

    createUser(createUserDto: BlockchainUserDto, request: any): Observable<string> {
        return this.isValidUser(request).pipe(
            map((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    this.contractsService.createNewUser(createUserDto);
                    return 'Created new expert blockchain user';
                }
                else {
                    return 'Error, no user created, authentication issue';
                }
            }),
        );
    }

    createCentralizedUser(createUserDto: CentralizedBlockchainUserDto, request: any): Observable<string> {
        return this.isValidUser(request).pipe(
            map((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    this.contractsService.createNewCentralizedUser(createUserDto);
                    return 'Created new centralized blockchain user';
                }
                else {
                    return 'Error, no user created, authentication issue';
                }
            }),
        );
    }

    removeUser(removeUserDto: UserRemovalDto, request: any): Observable<string> {
        return this.isValidUser(request).pipe(
            map((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    this.contractsService.removeUser(removeUserDto);
                    return 'Removed User';
                }
                else {
                    return 'Error, user could not be removed, authentication issue';
                }
            }),
        );
    }

    swapCentralizedUserRecovery(swapRecoveryCentralized: SwapRecoveryCentralizedDto, request: any): Observable<string> {
        return this.isValidUser(request).pipe(
            map((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    this.contractsService.swapCentralizedUserRecovery(swapRecoveryCentralized);
                    return 'Swapped centralized user';
                }
                else {
                    return 'Error, user recovery could not be swapped due to authentication issues';
                }
            }),
        );
    }

    addExtraKeyForSvandisCentralizedUserAccounts(addExtraRecovery: AddExtraRecoveryCentralizedDto, request: any): Observable<string> {
        return this.isValidUser(request).pipe(
            map((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    this.contractsService.addExtraKeyForSvandisCentralizedUserAccounts(addExtraRecovery);
                    return 'Extra key added for centralized user';
                }
                else {
                    return 'Error, user key could not be added due to authentication issues';
                }
            }),
        );
    }

    isValidUser(request: any): Observable<AxiosResponse<boolean>> {
        const authJWT = request.headers.authorization;
        const URL = SvandisApi.API_URL + '/user/check';
        return this.httpService.get(URL, {headers: {Authorization: authJWT}});
    }
}
