import { Global, Module } from "@nestjs/common";
import { AuthService } from './auth.service';
import {UsersModule} from '../users/users.module'
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
// import { jwtConstants } from '../common/constants/jwtConstants';
import { JwtStrategy } from './jwt.strategy';
import { CognitoStrategy } from './cognito.strategy';
import {HttpModule} from '@nestjs/axios';




@Global()
@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({

    }),
    HttpModule
  ],
  providers: [
    AuthService,
    JwtStrategy,
    CognitoStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
