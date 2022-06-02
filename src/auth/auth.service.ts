import { Injectable, BadRequestException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";

import {
  CognitoUserPool,
} from "amazon-cognito-identity-js";

import { LoginResDto } from "./dto/login-res.dto";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { ConfirmSignupDto } from "./dto/confirm-signup.dto";
import { handleExceptions } from "../common/utils/exceptionHandler";
import { AUTH_CONFIRM_RESULT, UserTypes } from "../common/constants";
import { AuthenticateRes, SignupRes } from "./auth.interface";
import { LoginReqDto } from "./dto/login-req.dto";
import { UserDto } from "../users/dto/user.dto";
import {CognitoService} from '../common/services/cognito.service';


@Injectable()
export class AuthService {

  private userPool: CognitoUserPool;

  constructor(
    private usersService: UsersService,
    private cognitoService: CognitoService,
    private readonly configService: ConfigService
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get("cognito.userPoolId"),
      ClientId: this.configService.get("cognito.clientId")
    });
  }

  get secretKey() {
    return this.configService.get("salt");
  }


  async signup(userDto: CreateUserDto): Promise<SignupRes> {

    // set as staff by default if don't have
    const user_type = userDto.user_type || UserTypes.Staff;
    userDto.user_type = user_type;

    try {

      const createUserResult: any = await this.cognitoService.signup(userDto);

      return {
        email: createUserResult.user.username,
        userSub: createUserResult.userSub,
        userConfirmed: createUserResult.userConfirmed,
        user: userDto
      };

    } catch (err) {
      handleExceptions(err);
    }
  }

  async confirmSignup(dto: ConfirmSignupDto): Promise<any> {

    try {

      const confirmResult = await this.cognitoService.confirmSignup(dto)

      if (confirmResult === AUTH_CONFIRM_RESULT.SUCCESS) {
        return confirmResult;
      } else {
        throw 404;
      }
    } catch (err) {
      handleExceptions(err);
    }

  }

  async login(data): Promise<LoginResDto> {

    const foundUser = await this.usersService.findByUserEmail(data.user?.email)
    const userDto = new UserDto(foundUser.toJSON());
    return new LoginResDto(data, userDto);

  }

  async authenticate(dto: LoginReqDto): Promise<AuthenticateRes> {
    try {
      return this.cognitoService.authenticate(dto)
    } catch (err) {
      handleExceptions(err);
    }
  }
}
