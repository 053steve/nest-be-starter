import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from "class-validator";

export class AuthDto {

  @ApiProperty()
  @IsString()
  email: string;


  @ApiProperty()
  @IsString()
  password: string;
}
