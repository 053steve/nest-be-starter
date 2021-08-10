import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { REPOSITORY } from "../common/constants";
import { User } from "./entities/user.entity";
import { UserDto } from "./dto/user.dto";

@Injectable()
export class UsersService {

  constructor(
    @Inject(REPOSITORY.USERS)
    private userRepository: typeof User
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {

    const newUser = await this.userRepository.create(createUserDto);
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

  remove(id: number) {
    return this.userRepository.destroy({where: {id}});
  }
}
