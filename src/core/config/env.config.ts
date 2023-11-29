import * as Joi from 'joi';

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
    Provision = 'provision',
  }


export const validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid(...Object.values(Environment))
        .default(Environment.Development),
    PORT: Joi.number().default(3000),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().required(),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_NAME: Joi.string(),
    CLOUDINARY_NAME: Joi.string().required(),
    CLOUDINARY_API_KEY: Joi.string().required(),
    CLOUDINARY_API_SECRET: Joi.string().required(),
    JWT_TOKEN_PRIVATE_KEY: Joi.string().required(),
    JWT_TOKEN_AUDIENCE: Joi.string().required(),
    JWT_TOKEN_EXPIRE_IN: Joi.string().default('2h'),
    JWT_TOKE_RECOVERY_PASSWORD: Joi.string().default('5m'),
    SERVER_URL: Joi.string().required(),
    SERVER_EMAIL_ADDRES: Joi.string().required(),
    AWS_SECRET_ACCES_KEY: Joi.string().required(),
    AWS_ACCES_KEY: Joi.string().required()
});