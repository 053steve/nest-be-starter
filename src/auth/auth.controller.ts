import { Controller, Request, Post, UseGuards, Body } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from "./dto/auth.dto";
import { ApiImplicitBody } from "@nestjs/swagger/dist/decorators/api-implicit-body.decorator";

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiImplicitBody({content:null, name: 'user', type: AuthDto})
  async login(
    @Request() req
  ) {
    return req.user;
  }
}
