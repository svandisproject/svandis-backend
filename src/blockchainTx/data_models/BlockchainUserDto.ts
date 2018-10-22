import { IsString, IsInt } from 'class-validator';

export class BlockchainUserDto {
    @IsString()
    readonly userAddress: string;

    @IsString()
    readonly recoveryAddress: string;
}