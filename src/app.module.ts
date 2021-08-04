import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DBModule } from './core/db/db.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, DBModule, AuthModule],
})
export class AppModule { }
