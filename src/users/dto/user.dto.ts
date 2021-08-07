import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from "../../common/dto/base.dto";
import { UserTypes } from "../../common/constants";

export class UserDto extends Base{

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  user_type: UserTypes;


  constructor(user: User) {
    super();
    this.id = user.id;
    this.email = user.email;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.username = user.username;
    this.user_type = user.user_type;
  }
}
