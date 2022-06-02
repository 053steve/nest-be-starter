import { Injectable, BadRequestException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";

import {
  CognitoUserPool,
  CognitoUserAttribute, CognitoUser
} from "amazon-cognito-identity-js";

import bcrypt from "bcryptjs";
import { LoginResDto } from "./dto/login-res.dto";
import { User } from "../users/entities/user.entity";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { ConfirmSignupDto } from "./dto/confirm-signup.dto";
import { handleExceptions } from "../common/utils/exceptionHandler";
import { AUTH_CONFIRM_RESULT, UserTypes } from "../common/constants";


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


  async validateUser(email: string, pass: string): Promise<User> {

    const user = await this.usersService.findByUserEmail(email);
    // if (user && this.validatePassword(user.password, pass)) {
    //   return user;
    // }

    return null;
  }

  async signup(dto: CreateUserDto): Promise<any> {
    const { firstname, lastname, username, email, password, phoneNumber } = dto;

    const attributeList = [];

    // map to cognito user attribute
    const fistNameData = {
      Name: "given_name",
      Value: firstname
    };

    const lastnameData = {
      Name: "family_name",
      Value: lastname
    };

    const usernameData = {
      Name: "preferred_username",
      Value: username
    };

    const emailData = {
      Name: "email",
      Value: email
    };

    const phone_number = {
      Name: "phone_number",
      Value: phoneNumber
    };

    const userType = {
      Name: "custom:user_type",
      Value: UserTypes.Staff
    };

    const attributeEmail = new CognitoUserAttribute(emailData);
    const attributePhoneNumber = new CognitoUserAttribute(phone_number);
    const attributeFirstName = new CognitoUserAttribute(fistNameData);
    const attributeLastName = new CognitoUserAttribute(lastnameData);
    const attributeUsername = new CognitoUserAttribute(usernameData);
    const attributeUserType = new CognitoUserAttribute(userType);

    attributeList.push(attributeEmail);
    attributeList.push(attributeFirstName);
    attributeList.push(attributePhoneNumber);
    attributeList.push(attributeLastName);
    attributeList.push(attributeUsername);
    attributeList.push(attributeUserType);


    try {

      const createUserResult = await new Promise((resolve, reject) => {
        this.userPool.signUp(email, password, attributeList, null, (err, result) => {
          if (err) {
            reject(err.message);
          }
          resolve(result);
        });
      });

      return createUserResult;

    } catch (err) {
      return new BadRequestException(err);
    }
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

  async login(user): Promise<LoginResDto> {

    // const token = this.generateToken(user);
    return new LoginResDto(user);

  }


  // generateToken(user) {
  //   return this.jwtService.sign({ id: user.id, user_type: user.user_type  });
  // }
}
