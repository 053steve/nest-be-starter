import { ApiProperty } from "@nestjs/swagger";

export class Base {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;

}
