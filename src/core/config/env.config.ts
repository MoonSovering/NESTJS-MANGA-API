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
<<<<<<< HEAD
    PORT: Joi.number().default(3000)
    
})
  
=======
    PORT: Joi.number().default(3000),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().required(),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_NAME: Joi.string(),
    CLOUDINARY_NAME: Joi.string().required(),
    CLOUDINARY_API_KEY: Joi.string().required(),
    CLOUDINARY_API_SECRET: Joi.string().required()
})
>>>>>>> 5853b24 (feat adding user module)
