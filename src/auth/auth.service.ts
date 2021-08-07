import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { LoginResDto } from "./dto/login-res.dto";


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {

    const user = await this.usersService.findByUserEmail(email);

    if (user && this.validatePassword(user.password, pass)) {
      return user;
    }

    return null;
  }

  async login(user: any): Promise<LoginResDto> {

    const token = this.generateToken(user);
    return new LoginResDto(user, token);

  }

  async validatePassword(password, comparePass) {
    const isMatch = await bcrypt.compare(password, comparePass);
    return isMatch;
  }


  generateToken(user) {
    return this.jwtService.sign({ id: user.id, user_type: user.user_type  });
  }
}
