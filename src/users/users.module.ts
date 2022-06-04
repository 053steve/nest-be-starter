import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { userProviders } from './user.provider';
import { CommonModule } from "../common/common.module";

@Module({
  controllers: [UsersController],
  imports: [
    CommonModule
  ],
  providers: [
    UsersService,
    ...userProviders,

  ],
  exports: [UsersService]
})
export class UsersModule {}
