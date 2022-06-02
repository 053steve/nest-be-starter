import { ConfigService } from "@nestjs/config";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool
} from "amazon-cognito-identity-js";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { ConfirmSignupDto } from "../../auth/dto/confirm-signup.dto";
import { LoginReqDto } from "../../auth/dto/login-req.dto";
import { AuthenticateRes } from "../../auth/auth.interface";
import { UserDto } from "../../users/dto/user.dto";


export class CognitoService {

  private userPool: CognitoUserPool;

  constructor(
    private readonly configService: ConfigService
  ) {

    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get("cognito.userPoolId"),
      ClientId: this.configService.get("cognito.clientId")
    });
  }

  async signup(userDto: CreateUserDto) {
    const attributeList = this.mapObjToCognitoAttributeList(userDto);

    return await new Promise((resolve, reject) => {
      this.userPool.signUp(userDto.email, userDto.password, attributeList, null, (err, result) => {
        if (err) {
          reject(err.message);
        }
        resolve(result);
      });
    });
  }

  async confirmSignup(dto: ConfirmSignupDto) {

    const userData = {
      Username: dto.email,
      Pool: this.userPool
    };

    const cognitoUser = new CognitoUser(userData);

    return await new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(dto.verifyCode, true, function(err, result) {
        if (err) {
          reject(err.message);
          return;
        }
        resolve(result);
      });
    });

  }

  mapObjToCognitoAttributeList = (userDto) => {
    const attributeList = [];

    // map to cognito user attribute
    for (const [key, value] of Object.entries(userDto)) {

      let objName = {};

      switch (key) {
        case "firstname":
          objName = "given_name";
          break;

        case "lastname":
          objName = "family_name";
          break;

        case "username":
          objName = "preferred_username";
          break;

        case "email":
          objName = "email";
          break;

        case "phoneNumber":
          objName = "phone_number";
          break;

      }

      const dataObj = {
        Name: objName,
        Value: value
      };

      attributeList.push(dataObj);

    }

    return attributeList;
  };

  async authenticate(dto: LoginReqDto): Promise<AuthenticateRes> {

    const authData = {
      Username: dto.email,
      Password: dto.password
    };

    const authDetails = new AuthenticationDetails(authData);

    const userData = {
      Username: dto.email,
      Pool: this.userPool
    };

    const cognitoUser = new CognitoUser(userData);


    const authRes: AuthenticateRes = await new Promise((resolve, reject) => {
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
        }
      });
    });


    return authRes;

  }

}