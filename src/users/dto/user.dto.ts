
import { Base } from "../../common/dto/base.dto";


export class UserDto extends Base {

  firstname: string;
  lastname: string;
  email: string;
  username: string;
  user_type: string;
  userConfirmed: boolean;


  constructor(partial: Partial<any>) {
    super();
    Object.assign(this, partial);

  }
}
