import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import {UsersService} from '../users/users.service';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService
  ) {

    const issuer = configService.get('cognito.issuer');
    const jwksUri = `${issuer}/.well-known/jwks.json`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri
      }),
      issuer,
      algorithms: ['RS256'],
    });
  }


  async validate(payload: any) {
    if (!payload?.sub) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findUserBySub(payload.sub);
    return user.toJSON();


  }
}