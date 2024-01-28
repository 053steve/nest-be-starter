import {
  Controller,
  Request,
  Post,
  UseGuards, HttpCode, Body
} from "@nestjs/common";
import { LoginReqDto } from "./dto/login-req.dto";
import { ApiTags, ApiBody } from "@nestjs/swagger";
import {CognitoAuthGuard} from './cognito.guard';
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { ConfirmSignupDto } from "./dto/confirm-signup.dto";
import { UsersService } from "../user/user.service";
import { UserTypes } from "src/common/constants";


@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) { }

  @Post("login")
  @HttpCode(200)
  @ApiBody({ type: [LoginReqDto] })
  async login(
    @Request() req
  ) {
    const response = await this.authService.authenticate(req.body);
    return this.authService.login(response);
  }

  @Post("signup")
  @HttpCode(201)
  async signup(@Body() createUserDto: CreateUserDto) {
    const cognitoUserRes = await this.authService.signup(createUserDto);
    // console.log('yo');
    // console.log('got here');

    // will need to save username and userSub when create in local DB
    const newUser = await this.userService.create({
      email: cognitoUserRes.email,
      sub: cognitoUserRes.userSub,
      userConfirmed: cognitoUserRes.userConfirmed,
      firstname: cognitoUserRes.user.firstname,
      lastname: cognitoUserRes.user.lastname,
      username: cognitoUserRes.user.username,
      phoneNumber: cognitoUserRes.user.phoneNumber,
      user_type: cognitoUserRes.user.user_type,
    });

    return;
  }

  @Post("confirm-signup")
  @HttpCode(200)
  async confirmSignup(@Body() dto: ConfirmSignupDto) {
    await this.authService.confirmSignup(dto);
    await this.userService.updateByEmail(dto.email, {
      userConfirmed: true
    });
    return;
  }


}
