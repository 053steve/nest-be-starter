import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString } from "class-validator";

export class ListUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  limit?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  startKeyEmail?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  startKeyCreatedAt?: string;


}