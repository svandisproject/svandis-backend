import { IsString, IsInt } from 'class-validator';

export class CentralizedBlockchainUserDto {
    @IsString()
    readonly dataSignature: string;

    @IsString()
    readonly recoveryAddress: string;
}