import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { REPOSITORY } from "../common/constants";
import { User } from "./entities/user.entity";
import { UserDto } from "./dto/user.dto";
import { CreateUserInput } from "../auth/auth.interface";

@Injectable()
export class UsersService {

  constructor(
    @Inject(REPOSITORY.USERS)
    private userRepository: typeof User
  ) {}

  async create(userData: CreateUserInput): Promise<UserDto> {

    const newUser = await this.userRepository.create(userData);
    return new UserDto(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll<User>({where: {}});
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id }});
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username }});
  }

  findByUserEmail(email: string) {
    return this.userRepository.findOne({ where: { email }});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(updateUserDto, {where: {id}});
  }

  updateByEmail(email: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(updateUserDto, {where: {email}});
  }

  remove(id: number) {
    return this.userRepository.destroy({where: {id}});
  }
}
