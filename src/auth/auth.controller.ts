import {
  Controller,
  Request,
  Post,
  UseGuards
} from "@nestjs/common";
import { LoginReqDto } from "./dto/login-req.dto";
import { ApiImplicitBody } from "@nestjs/swagger/dist/decorators/api-implicit-body.decorator";
import { ApiTags } from "@nestjs/swagger";
import { UserDto } from "../users/dto/user.dto";
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
  @ApiImplicitBody({ content: null, name: "user", type: LoginReqDto })
  async login(
    @Request() req
  ) {
    return this.authService.login(req.user);
  }
}
