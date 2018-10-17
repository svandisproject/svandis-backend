import { IsString, IsInt } from 'class-validator';

export class AddExtraRecoveryCentralizedDto {
    @IsString()
    readonly address: string;

    @IsString()
    readonly newRecoveryMethod: string;
}