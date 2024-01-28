import { IsString, IsEmail, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {

  @ApiProperty()
  @IsString()
  firstname: string;

  @ApiProperty()
  @IsString()
  lastname: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  user_type?: string;

}
