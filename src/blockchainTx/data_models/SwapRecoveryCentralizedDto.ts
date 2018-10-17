import { IsString, IsInt } from 'class-validator';

export class SwapRecoveryCentralizedDto {
    @IsString()
    readonly currentAddress: string;

    @IsString()
    readonly newRecoveryAddress: string;
}