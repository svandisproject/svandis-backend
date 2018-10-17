import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    constructor(){}
    root(): string {
      return 'This is the Svandis Backend!';
    }
}
