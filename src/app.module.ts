import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DBModule } from './core/db/db.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';


const ENV = process.env.NODE_ENV || 'development';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/.env.${ENV}`,
      isGlobal: true,
      load: [configuration],
    }),
    UsersModule,
    DBModule,
    AuthModule
  ]
})
export class AppModule { }
