import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DDB_Module } from './core/db/ddb.module';
import { AuthModule } from './auth/auth.module';
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
    DDB_Module,
    // AuthModule,

  ],
})
export class AppModule { }
