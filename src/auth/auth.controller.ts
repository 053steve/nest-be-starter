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


@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService
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
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
    // will need to save username and userSub when create in local DB
  }

  @Post("confirm-signup")
  @HttpCode(200)
  confirmSignup(@Body() dto: ConfirmSignupDto) {
    return this.authService.confirmSignup(dto);
  }


}
