import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from "class-validator";

export class ConfirmSignupDto {

  @ApiProperty()
  @IsEmail()
  email: string;


  @ApiProperty()
  @IsString()
  verifyCode: string;
}
