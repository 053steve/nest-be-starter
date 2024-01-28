import { UserDto } from "../../user/dto/user.dto";
import { AuthenticateRes } from "../auth.interface";
import { User } from "../../user/entities/user.entity";


export class LoginResDto {

  idToken: string
  accessToken: string
  refreshToken: string


  constructor(authRes: AuthenticateRes) {

    this.idToken = authRes.idToken;
    this.accessToken = authRes.accessToken;
    this.refreshToken = authRes.refreshToken;
  }
}
