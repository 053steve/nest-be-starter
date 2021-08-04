import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from "../../common/dto/base.dto";

export class UserDto extends Base{

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;


  constructor(user: User) {
    super();
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstname;
    this.lastName = user.lastname;
    this.username = user.username;
  }
}
