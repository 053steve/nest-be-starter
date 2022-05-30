import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserDto } from "./dto/user.dto";
import { User } from "./models/user.model";
import { UserRepository } from './user.repository';
import { FindOneParams } from "./dto/FindOneParams.dto";
import { handleExceptions } from "../common/utils/exeptionHandlers";
import { ListUserDto } from "./dto/list-user.dto";


@Injectable()
export class UsersService {

  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }


  async create(createUserDto: CreateUserDto): Promise<User> {

    try {
      const newUser = await this.userRepository.create(createUserDto);
      return newUser;

    } catch (err) {
      handleExceptions(err);
    }

  }



  async findAll(dto: ListUserDto): Promise<User[]> {
    return await this.userRepository.list(dto);
  }

  // findOne(id: number) {
  //   return this.userRepository.findOne({ where: { id }});
  // }
  //
  // findByUsername(username: string) {
  //   return this.userRepository.findOne({ where: { username }});
  // }
  //
  async findByUserEmail(data: FindOneParams)  {
    try {

      const user = this.userRepository.getOne(data);

      if (!user) {
        throw 404;
      }

      return user;

    } catch (err) {

    }

  }

  update(email, updateUserDto: UpdateUserDto) {

    try {
      return this.userRepository.update(email, updateUserDto)
    } catch (err) {
      handleExceptions(err);
    }

  }

  remove(email: string) {
    try {
      return this.userRepository.delete(email);
    } catch (err) {
      handleExceptions(err);
    }

  }
}
