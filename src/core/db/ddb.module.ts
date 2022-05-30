import { Module } from '@nestjs/common';
import { databaseProviders } from './ddb.provider';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DDB_Module {}
