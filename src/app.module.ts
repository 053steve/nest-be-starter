import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DBModule } from './core/db/db.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';


const ENV = process.env.NODE_ENV || 'development';



@Module({
  imports: [
    UsersModule,
    DBModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: `env/.env.${ENV}`,
      isGlobal: true,
      load: [configuration],
    })
  ],
})
export class AppModule { }
