import { IsString, IsInt } from 'class-validator';

export class AddExtraKeyCentralizedDto {
    @IsString()
    readonly currentAddress: string;

    @IsString()
    readonly newKeyAddress: string;
}