import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from "../../common/dto/base.dto";
import { UserTypes } from "../../common/constants";
import { Exclude } from 'class-transformer';


export class UserDto extends Base {

  firstname: string;
  lastname: string;
  email: string;
  username: string;
  user_type: string;
  userConfirmed: boolean;


  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
