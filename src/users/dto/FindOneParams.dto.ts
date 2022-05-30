import { IsNotEmpty, IsNumberString, IsEmail } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from "class-transformer";


export class FindOneParams {
  @Type(() => String)
  // @IsNumberString()
  @ApiProperty()
  email: string;

}
