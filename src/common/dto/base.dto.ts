import { ApiProperty } from "@nestjs/swagger";

export class Base {

  id: number;
  createdAt?: Date;
  updatedAt?: Date;

}
