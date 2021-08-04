import {
  Controller,
  Request,
  Post,
  UseGuards
} from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { LoginReqDto } from "./dto/login-req.dto";
import { ApiImplicitBody } from "@nestjs/swagger/dist/decorators/api-implicit-body.decorator";
import { ApiTags } from "@nestjs/swagger";
import { User } from "../users/entities/user.entity";
import { UserDto } from "../users/dto/user.dto";



@ApiTags('auth')
@Controller('auth')
export class AuthController {

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiImplicitBody({content:null, name: 'user', type: LoginReqDto})
  async login(
    @Request() req
  ): Promise<UserDto> {
    return req.user;
  }
}
