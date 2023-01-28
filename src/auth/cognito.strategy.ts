import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';


@Injectable()
export class CognitoStrategy extends PassportStrategy(Strategy, 'cognito') {


  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super();
  }

  async validate(req: Request): Promise<any> {
      const body = req.body as any
      const authRes = await this.authService.authenticate(body);
      if (authRes) {
        return authRes;
      }
      return null;
  }
}
