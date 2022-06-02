import { CreateUserDto } from "../users/dto/create-user.dto";

export interface SignupRes {
  email: string
  userSub: string
  userConfirmed: boolean
  user: CreateUserDto
}

export interface CreateUserInput {
  email: string
  sub: string
  userConfirmed: boolean
  firstname: string
  lastname: string
  username: string
  phoneNumber: string
  user_type: string
}