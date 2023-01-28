import { ConfigService } from "@nestjs/config";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { ConfirmSignupDto } from "../../auth/dto/confirm-signup.dto";
import { LoginReqDto } from "../../auth/dto/login-req.dto";
import { AuthenticateRes } from "../../auth/auth.interface";


import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  AdminDeleteUserCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { UpdateUserDto } from "../../users/dto/update-user.dto";
import { Injectable } from "@nestjs/common";
import { AUTH_FLOW } from "../constants";




@Injectable()
export class CognitoService {

  private client: CognitoIdentityProviderClient;
  private verifierClient;

  constructor(
    private readonly configService: ConfigService
  ) {

    this.client = new CognitoIdentityProviderClient({
      region: this.configService.get("aws.region"),
      credentials: {
        accessKeyId: this.configService.get("aws.accessKey"),
        secretAccessKey: this.configService.get("aws.secretKey"),
      }
    });

  }


  async signup(userDto: CreateUserDto) {
    const { email, password } = userDto;


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

    const authInput = {
      AuthFlow: AUTH_FLOW.USER_PASSWORD_AUTH,
      ClientId: this.configService.get('cognito.clientId'),
      AuthParameters: {
        USERNAME: dto.email,
        PASSWORD: dto.password
      }
    }

    const command = new InitiateAuthCommand(authInput);

    const result = await this.client.send(command);
    return {
      accessToken: result.AuthenticationResult.AccessToken,
      idToken: result.AuthenticationResult.IdToken,
      refreshToken: result.AuthenticationResult.RefreshToken
    };

  }

  async adminUpdateUserAttributes(targetEmail: string, dto: UpdateUserDto): Promise<void> {

    const attributeList = this.mapObjToCognitoAttributeList(dto);

    const updateInput = {
      UserPoolId: this.configService.get("cognito.userPoolId"),
      Username: targetEmail,
      UserAttributes: attributeList
    }

    const command = new AdminUpdateUserAttributesCommand(updateInput);
    const result = await this.client.send(command);
    return;
  }

  async adminDeleteUser(targetEmail: string): Promise<void> {

    const input = {
      UserPoolId: this.configService.get("cognito.userPoolId"),
      Username: targetEmail,
    }

    const command = new AdminDeleteUserCommand(input);
    const result = await this.client.send(command);
    return;
  }

}
