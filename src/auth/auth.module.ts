import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {UsersModule} from '../users/users.module'
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../common/constants/jwtConstants';
import { JwtStrategy } from './jwt.strategy';
import { CognitoStrategy } from './cognito.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6h' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    CognitoStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
