import { IsString, IsInt } from 'class-validator';

export class CentralizedBlockchainUserDto {
    @IsString()
    readonly userAddressSignature: string;
}