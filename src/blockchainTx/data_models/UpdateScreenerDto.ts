import { IsString, IsInt } from 'class-validator';

export class UpdateScreenerDto {
    @IsString()
    readonly dataAddress: string;

    @IsString()
    readonly newDataLoad: string;

}