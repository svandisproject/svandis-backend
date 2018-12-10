import { IsString, IsInt } from 'class-validator';

export class ConvertBeginnerToExpertDto {
    @IsString()
    readonly currentAddress: string;

    @IsString()
    readonly newRecoveryAddress: string;
}