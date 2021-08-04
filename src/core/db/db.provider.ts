import { Sequelize } from "sequelize-typescript";
import { User } from "../../users/entities/user.entity";

export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "root",
        database: "Test_Sql",
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      });
      sequelize.addModels([User]);

      await sequelize.sync({force: false, alter: true, logging: true});
      return sequelize;
    }
  }
];
