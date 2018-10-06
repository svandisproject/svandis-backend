import { IsString, IsInt } from 'class-validator';

export class NewUserDto {
    @IsString()
    readonly dataSignature: string;

    @IsString()
    readonly recoveryAddress: string;
}