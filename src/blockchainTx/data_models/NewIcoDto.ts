import { IsString, IsInt } from 'class-validator';

export class NewIcoDto {
    @IsString()
    readonly dataLoad: string;

    @IsString()
    readonly ticker: string;

    @IsString()
    readonly projectName: string;

    @IsString()
    readonly projectWebsite: string;

    @IsInt()
    readonly unixTokenGenerationTimestamp: number;
}