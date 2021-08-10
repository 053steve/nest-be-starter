require('./pgEnum-fix');
import { Sequelize } from "sequelize-typescript";
import { ConfigService } from '@nestjs/config';
import * as glob from 'glob';
import {User} from '../../users/entities/user.entity';




export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: configService.get('database.dialect'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        pool: {
          max: configService.get<number>('database.pool.max'),
          min: configService.get<number>('database.pool.min'),
          acquire: configService.get<number>('database.pool.acquire'),
          idle: configService.get<number>('database.pool.idle')
        }
      });

      const ext = (process.env.NODE_ENV == 'production') ? 'js' : 'ts';

      const modelPaths = glob.sync(`**/*.entity.${ext}`, null).map(it => __dirname + it);


      sequelize.addModels([User]);

      await sequelize.sync({force: false, alter: false, logging: true});
      return sequelize;
    }
  }
];

