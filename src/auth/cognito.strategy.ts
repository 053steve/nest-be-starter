import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from "../users/dto/user.dto";
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';


@Injectable()
export class CognitoStrategy extends PassportStrategy(Strategy, 'cognito') {


  constructor(
    private configService: ConfigService
  ) {
    super();
  }

  async validate(): Promise<any> {
    const test = this.configService.get('cognito.userPoolId');
    console.log('config test');
    console.log(test);
    const valid = true;
    if(!valid) throw new UnauthorizedException();
    return {id: "123", name: "test"};
  }
}
