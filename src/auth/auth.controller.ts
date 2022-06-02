import {
  Controller,
  Request,
  Post,
  UseGuards, HttpCode, Body
} from "@nestjs/common";
import { LoginReqDto } from "./dto/login-req.dto";
import { ApiImplicitBody } from "@nestjs/swagger/dist/decorators/api-implicit-body.decorator";
import { ApiTags } from "@nestjs/swagger";
import {CognitoAuthGuard} from './cognito.guard';
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { ConfirmSignupDto } from "./dto/confirm-signup.dto";
import { UsersService } from "../users/users.service";
import { UserTypes } from "src/common/constants";


@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) { }

  @UseGuards(CognitoAuthGuard)
  @Post("login")
  @HttpCode(200)
  @ApiImplicitBody({ content: null, name: "user", type: LoginReqDto })
  async login(
    @Request() req
  ) {
    return this.authService.login(req.user);
  }

  @Post("signup")
  @HttpCode(201)
  async signup(@Body() createUserDto: CreateUserDto) {
    const cognitoUserRes = await this.authService.signup(createUserDto);

    // will need to save username and userSub when create in local DB
    const newUser = this.userService.create({
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
