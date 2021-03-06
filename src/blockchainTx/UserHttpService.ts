import {HttpService, Injectable} from '@nestjs/common';
import {ContractsService} from './web3/ContractsService';
import {Observable} from 'rxjs';
import {User} from './api/User';
import {map, switchMap} from 'rxjs/operators';
import {AxiosResponse} from 'axios';
import {Request} from 'express';

@Injectable()
export class UserHttpService {
    private readonly USER_ME_URL = 'https://svandis-api-prod.herokuapp.com/api/user/me';
    private readonly USER_URL = 'https://svandis-api-prod.herokuapp.com/api/user/';
    private user: User;
    constructor(private httpService: HttpService) {
    }

    public getCurrentUser(userRequest: Request): Observable<User> {
        return this.getUser(userRequest)
            .pipe(
                map(apiUser => {
                    console.log(apiUser.data);
                    this.user = apiUser.data;
                    return this.user;
                }));
    }

    public getUser(userRequest: Request): Observable<AxiosResponse<User>> {
        const authJWT = userRequest.headers.authorization;
        return this.httpService.get(this.USER_ME_URL, {headers: {Authorization: authJWT}});
    }

    public putCurrentUser(userRequest: Request, userRequestBody: string, id: string): Observable<any>{
        const authJWT = userRequest.headers.authorization;
        return this.httpService.put(this.USER_URL + id, userRequestBody, {headers: {'Authorization': authJWT, 'Content-Type': 'application/json'}});
    }

}