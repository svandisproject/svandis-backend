import {HttpService, Injectable} from '@nestjs/common';
import {BlockchainUserDto} from './data_models/BlockchainUserDto';
import {ContractsService} from './web3/ContractsService';
import {CentralizedBlockchainUserDto} from './data_models/CentralizedBlockchainUserDto';
import {UserRemovalDto} from './data_models/UserRemovalDto';
import {SwapRecoveryCentralizedDto} from './data_models/SwapRecoveryCentralizedDto';
import {AddExtraKeyCentralizedDto} from './data_models/AddExtraKeyCentralizedDto';
import {SvandisApi} from './config/SvandisApi';
import {Observable} from 'rxjs';
import {AxiosResponse} from 'axios';
import {map} from 'rxjs/operators';
import {ConvertBeginnerToExpertDto} from "./data_models/ConvertBeginnerToExpertDto";

@Injectable()
export class BlockchainUsersTxService {
    constructor(private contractsService: ContractsService, private httpService: HttpService) {
    }

    createUser(createUserDto: BlockchainUserDto, request: any): Observable<string> {
        return this.isValidUser(request).pipe(
            map((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    this.contractsService.createNewUser(createUserDto);
                    // Add is onboarded to the user profile on api
                    // Add is Centralized = false on user profile on api
                    // Update user identity contract address, user local address
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
                    // Add is onboarded to the user profile on api
                    // Add is Centralized = true on user profile on api
                    // Update user identity contract address, user local address
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
                    // This will not remove a users account with svandis
                    // Calling this the user should locally remove their key, and be prompted with password to make this change
                    // Removing user will remove access to their onchain reputation level, and is not recommended
                    // User should be set to isonboarded = false on api and centralized = true, all other blockchain fields wiped
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
                    // Update recovery key on USER api
                    return 'Swapped centralized user';
                }
                else {
                    return 'Error, user recovery could not be swapped due to authentication issues';
                }
            }),
        );
    }

    addExtraKeyForSvandisCentralizedUserAccounts(addExtraRecovery: AddExtraKeyCentralizedDto, request: any): Observable<string> {
        return this.isValidUser(request).pipe(
            map((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    this.contractsService.addExtraKeyForSvandisCentralizedUserAccounts(addExtraRecovery);
                    // Add more account keys on USER api
                    return 'Extra key added for centralized user';
                }
                else {
                    return 'Error, user key could not be added due to authentication issues';
                }
            }),
        );
    }

    convertBeginnerToExpertAccounts(convertBeginner: ConvertBeginnerToExpertDto, request: any): Observable<string> {
        return this.isValidUser(request).pipe(
            map((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    this.contractsService.convertBeginnerToExpert(convertBeginner);
                    // Add more account keys on USER api
                    return 'Converted Centralized user, gave up key to account';
                }
                else {
                    return 'Error, user could not be converted due to authentication issues';
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
