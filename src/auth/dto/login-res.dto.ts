import { UserDto } from "../../users/dto/user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";


export class LoginResDto extends UserDto {

  @ApiProperty()
  token: string;


  constructor(user: User, token?: string) {
    super(user);
    this.token = token;
  }
}
