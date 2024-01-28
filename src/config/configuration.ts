export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  database: {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 5,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000
    }
  },
  salt: process.env.SALT,
  cognito: {
    userPoolId: process.env.AWS_AUTH_USER_POOL_ID,
    clientId: process.env.AWS_AUTH_CLIENT_ID,
    issuer: process.env.ISSUER
  },
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
  },
  s3: {
    awsBucket: process.env.AWS_BUCKET
  }
});
