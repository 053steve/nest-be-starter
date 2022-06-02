import { Injectable, BadRequestException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";

import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,

} from "amazon-cognito-identity-js";

import { LoginResDto } from "./dto/login-res.dto";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { ConfirmSignupDto } from "./dto/confirm-signup.dto";
import { handleExceptions } from "../common/utils/exceptionHandler";
import { AUTH_CONFIRM_RESULT, UserTypes } from "../common/constants";
import { AuthenticateRes, SignupRes } from "./auth.interface";
import { LoginReqDto } from "./dto/login-req.dto";
import { UserDto } from "../users/dto/user.dto";


@Injectable()
export class AuthService {

  private userPool: CognitoUserPool;


  constructor(
    private usersService: UsersService,
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

    const attributeList = this.mapObjToCognitoAttributeList(userDto);

    try {

      const createUserResult: any = await new Promise((resolve, reject) => {
        this.userPool.signUp(userDto.email, userDto.password, attributeList, null, (err, result) => {
          if (err) {
            reject(err.message);
          }
          resolve(result);
        });
      });

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

  mapObjToCognitoAttributeList = (userDto) => {
    const attributeList = [];

    // map to cognito user attribute
    for (const [key, value] of Object.entries(userDto)) {

      let objName = {};

      switch (key) {
        case 'firstname':
          objName = 'given_name'
          break;

        case 'lastname':
          objName = 'family_name'
          break;

        case 'username':
          objName = 'preferred_username'
          break;

        case 'email':
          objName = 'email'
          break;

        case 'phoneNumber':
          objName = 'phone_number'
          break;

      }

      const dataObj = {
        Name: objName,
        Value: value
      }

      attributeList.push(dataObj);

    }

    return attributeList;
  }

  async confirmSignup(dto: ConfirmSignupDto): Promise<any> {

    const userData = {
      Username: dto.email,
      Pool: this.userPool
    };

    try {

      const cognitoUser = new CognitoUser(userData);

      const confirmResult = await new Promise((resolve, reject) => {
        cognitoUser.confirmRegistration(dto.verifyCode, true, function(err, result) {
          if (err) {
            reject(err.message);
            return;
          }
          resolve(result);
        });

      });

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

  async cognitoAuthenticate(dto: LoginReqDto): Promise<AuthenticateRes> {

    const authData = {
      Username : dto.email,
      Password : dto.password,
    };

    const authDetails = new AuthenticationDetails(authData);

    const userData = {
      Username: dto.email,
      Pool: this.userPool
    };

    const cognitoUser = new CognitoUser(userData);

    try {

      const authRes:AuthenticateRes = await new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authDetails, {
          onSuccess: (result) => {
            const accessToken = result.getAccessToken().getJwtToken();
            const idToken = result.getIdToken().getJwtToken();
            const refreshToken = result.getRefreshToken().getToken();
            const payload = result.getIdToken().decodePayload();
            const user = new UserDto(payload);

            resolve({
              accessToken,
              idToken,
              refreshToken,
              user
            });
          },
          onFailure: (err) => {
            reject(err);
          },
        });
      });


      return authRes;

    } catch (err) {
      handleExceptions(err);
    }





  }


  // generateToken(user) {
  //   return this.jwtService.sign({ id: user.id, user_type: user.user_type  });
  // }
}
