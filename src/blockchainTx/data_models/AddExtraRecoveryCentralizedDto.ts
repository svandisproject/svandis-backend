import { IsString, IsInt } from 'class-validator';

export class AddExtraRecoveryCentralizedDto {
    @IsString()
    readonly currentAddress: string;

    @IsString()
    readonly newRecoveryMethod: string;
}