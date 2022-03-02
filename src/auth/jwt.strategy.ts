import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {jwtConstants} from '../common/constants/jwtConstants';
// import bcrypt from "bcryptjs";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  //TODO: Have to do something with this
  async validate(payload: any) {
    return { userId: payload.id, username: payload.username };
  }
}