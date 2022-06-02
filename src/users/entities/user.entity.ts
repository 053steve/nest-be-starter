import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Model,
  Table,
  Default,
  Unique
} from "sequelize-typescript";
import { CreateUserDto } from "../dto/create-user.dto";
import bcrypt from "bcryptjs";
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
  @Unique(true)
  @Column(DataType.TEXT)
  email: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  sub: string;


  @Column(DataType.ENUM({values: Object.keys(UserTypes)}))
  user_type: UserTypes;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  userConfirmed: boolean;

  toJSON() {
    return {...super.toJSON()};
  }


  @BeforeCreate
  static async checkUsername(user: CreateUserDto) {
    // this will be called when an instance is created or updated

    // set set email as username
    if (!user.username) {    // If dont have username get username from email
      const splitEmail = user.email.split("@");
      user.username = splitEmail[0];
    }

  }


  static async createHash(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

}
