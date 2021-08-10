import { IsNotEmpty, IsNumberString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from "class-transformer";


export class FindOneParams {
  @Type(() => Number)
  @IsNumberString()
  @ApiProperty()
  id: number;


}
