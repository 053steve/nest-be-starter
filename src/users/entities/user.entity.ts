import { AllowNull, BeforeCreate, BeforeUpdate, Column, DataType, Model, Table } from "sequelize-typescript";
import { CreateUserDto } from "../dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { UserTypes } from "../../common/constants";


@Table
export class User extends Model {


  @Column(DataType.TEXT)
  firstname: string;

  @Column(DataType.TEXT)
  lastname: string;

  @Column(DataType.TEXT)
  username: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  email: string;

  @Column(DataType.TEXT)
  password: string;

  @Column(DataType.ENUM({values: Object.keys(UserTypes)}))
  user_type: UserTypes;


  @BeforeCreate
  static async checkUsername(user: CreateUserDto) {
    // this will be called when an instance is created or updated

    // set set email as username
    if (!user.username) {    // If dont have username get username from email
      const splitEmail = user.email.split("@");
      user.username = splitEmail[0];
    }

  }

  @BeforeCreate
  static async encryptPassword(user: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  @BeforeUpdate
  static async bfUpdate(user: any) {
    if (user.changed("password")) {
      user.password = await user.createHash(user.password);
    }
  }

}
