import { IsString, IsInt } from 'class-validator';

export class UserRemovalDto {
    @IsString()
    readonly userAddressForRemoval: string;
}