import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  firstname: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastname: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;
}
