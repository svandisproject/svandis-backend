import { IsString, IsInt } from 'class-validator';

export class BlockchainUserDto {
    @IsString()
    readonly dataSignature: string;

    @IsString()
    readonly recoveryAddress: string;
}