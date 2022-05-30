


export enum UserTypes {
  Admin = 'Admin',
  Staff = 'Staff'
}

export enum Tables {
  TestUser = 'Test-User'
}

export enum HashLinkers {
  USER = 'USER'
}

export const DYNAMO_DB_CONFIG = {
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
}