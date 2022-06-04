import { UserDto } from "../../users/dto/user.dto";
import { AuthenticateRes } from "../auth.interface";
import { User } from "../../users/entities/user.entity";


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
