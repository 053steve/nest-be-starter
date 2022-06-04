import { CreateUserDto } from "../users/dto/create-user.dto";
import { UserDto } from "../users/dto/user.dto";

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

export interface AuthenticateRes {
  user?: UserDto,
  idToken: string
  accessToken: string
  refreshToken: string
}

export interface ClaimVerifyRequest {
  readonly token?: string;
}

export interface ClaimVerifyResult {
  readonly userName: string;
  readonly clientId: string;
  readonly isValid: boolean;
  readonly error?: any;
}

export interface TokenHeader {
  kid: string;
  alg: string;
}
export interface PublicKey {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}

export interface PublicKeyMeta {
  instance: PublicKey;
  pem: string;
}

export interface PublicKeys {
  keys: PublicKey[];
}

export interface MapOfKidToPublicKey {
  [key: string]: PublicKeyMeta;
}

export interface Claim {
  token_use: string;
  auth_time: number;
  iss: string;
  exp: number;
  username: string;
  client_id: string;
}