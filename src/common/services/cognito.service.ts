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


import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
  AttributeType,
  SignUpCommand,
  ConfirmSignUpCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { UpdateUserDto } from "../../users/dto/update-user.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CognitoService {

  private userPool: CognitoUserPool;
  private client: CognitoIdentityProviderClient;

  constructor(
    private readonly configService: ConfigService
  ) {

    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get("cognito.userPoolId"),
      ClientId: this.configService.get("cognito.clientId")
    });

    this.client = new CognitoIdentityProviderClient({
      region: this.configService.get("aws.region"),
      credentials: {
        accessKeyId: this.configService.get("aws.accessKey"),
        secretAccessKey: this.configService.get("aws.secretKey"),
      }
    });
  }


  async signup(userDto: CreateUserDto) {
    const {email, password} = userDto;


    const attributeList = this.mapObjToCognitoAttributeList(userDto);

    const signUpInput = {
      Username: email,
      Password: password,
      ClientId: this.configService.get('cognito.clientId'),
      UserAttributes: attributeList
    }

    const command = new SignUpCommand(signUpInput);

    const result = await this.client.send(command);
    return result;

  }


  async confirmSignup(dto: ConfirmSignupDto) {
    const input = {
      ClientId: this.configService.get('cognito.clientId'),
      ConfirmationCode: dto.verifyCode,
      Username: dto.email
    }

    const command = new ConfirmSignUpCommand(input);
    const result = await this.client.send(command);
    return result;
  }

  mapObjToCognitoAttributeList = (userDto) => {
    const attributeList = [];

    // map to cognito user attribute
    for (const [key, value] of Object.entries(userDto)) {

      let dataObj;

      switch (key) {
        case "firstname":
          dataObj = {
            Name: "given_name",
            Value: value
          };
          break;

        case "lastname":
          dataObj = {
            Name: "family_name",
            Value: value
          };
          break;

        case "username":
          dataObj = {
            Name: "preferred_username",
            Value: value
          };
          break;

        case "email":
          dataObj = {
            Name: "email",
            Value: value
          };
          break;

        case "phoneNumber":
          dataObj = {
            Name: "phone_number",
            Value: value
          };
          break;

      }


      if (dataObj) {
        attributeList.push(dataObj);
      }

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

  async adminUpdateUserAttributes(targetEmail: string, dto: UpdateUserDto): Promise<void> {

    // const attributeList = this.mapObjToCognitoAttributeList(dto);
    const attributeList: AttributeType[] = [];
    const testData = {
      Name: 'given_name',
      Value: 'Steve'
    }

    attributeList.push(testData);

    const updateInput = {
      UserPoolId: this.configService.get("cognito.userPoolId"),
      Username: targetEmail,
      UserAttributes: attributeList
    }

    const command = new AdminUpdateUserAttributesCommand(updateInput);
    const result = await this.client.send(command);
    return;
  }

}
