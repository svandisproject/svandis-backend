import { IsString, IsInt } from 'class-validator';

export class BlockchainUserDto {
    @IsString()
    readonly userAddressSignature: string;

    @IsString()
    readonly recoveryAddress: string;
}