import { BaseModel } from "../../common/models/base.model";
import { HashLinkers, UserTypes } from "../../common/constants";
import { CreateUserDto } from "../dto/create-user.dto";
import { nanoid } from 'nanoid';


export class User extends BaseModel {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  user_type: UserTypes
  hashLinker: string;

  constructor(data: Partial<User> = {}) {
    data.hashLinker = HashLinkers.USER;
    super(data);
    Object.assign(this, data);
  }

  static async checkUsername(user: CreateUserDto) {
    // this will be called when an instance is created or updated

    // set set email as username
    if (!user.username) {    // If dont have username get username from email
      const splitEmail = user.email.split("@");
      user.username = splitEmail[0];
    }

  }

}