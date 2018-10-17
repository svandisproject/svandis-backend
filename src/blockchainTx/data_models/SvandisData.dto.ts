import { IsString, IsInt } from 'class-validator';

export class SvandisDataDto {
    @IsString()
    readonly datasignature: string;

    @IsInt()
    readonly svandisDataIndex: number;

    @IsString()
    readonly projectName: string;

    @IsInt()
    readonly projectWebsite: string;
}