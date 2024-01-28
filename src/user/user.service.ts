import { Injectable, Inject } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { REPOSITORY } from "../common/constants";
import { User } from "./entities/user.entity";
import { UserDto } from "./dto/user.dto";
import { CreateUserInput } from "../auth/auth.interface";
import { CognitoService } from "../common/services/cognito.service";
import { handleExceptions } from "../common/utils/exceptionHandler";

@Injectable()
export class UsersService {

  constructor(
    @Inject(REPOSITORY.USERS)
    private userRepository: typeof User,
    private cognitoService: CognitoService
  ) {
  }

  async create(userData: CreateUserInput): Promise<UserDto> {

    const newUser = await this.userRepository.create(userData);
    return new UserDto(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll<User>({ where: {} });
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  findByUserEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findUserBySub(sub: string) {
    return this.userRepository.findOne({ where: { sub } });
  }

  async adminUpdate(email: string, updateUserDto: UpdateUserDto) {
    try {
      await this.cognitoService.adminUpdateUserAttributes(email, updateUserDto);
      return this.userRepository.update(updateUserDto, { where: { email } });
    } catch (err) {
      handleExceptions(err);
    }
  }

  updateByEmail(email: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(updateUserDto, { where: { email } });
  }

  async remove(email: string) {
    await this.cognitoService.adminDeleteUser(email);
    return this.userRepository.destroy({ where: { email } });
  }
}
