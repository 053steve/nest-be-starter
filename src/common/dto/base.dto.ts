import { ApiProperty } from "@nestjs/swagger";

export class Base {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;

}
