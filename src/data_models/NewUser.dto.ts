import { IsString, IsInt } from 'class-validator';

export class NewUserDto {
    @IsString()
    readonly datasignature: string = '0x002393';

    @IsInt()
    readonly isExpert: number = 1;

    @IsString()
    readonly recoveryAddress: string = '0xrecovery';
}