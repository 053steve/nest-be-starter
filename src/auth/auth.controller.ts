import {
  Controller,
  Request,
  Post,
  UseGuards, HttpCode
} from "@nestjs/common";
import { LoginReqDto } from "./dto/login-req.dto";
import { ApiImplicitBody } from "@nestjs/swagger/dist/decorators/api-implicit-body.decorator";
import { ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "./local-auth-guard";
import { AuthService } from "./auth.service";


@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(200)
  @ApiImplicitBody({ content: null, name: "user", type: LoginReqDto })
  async login(
    @Request() req
  ) {
    return this.authService.login(req.user);
  }
}
