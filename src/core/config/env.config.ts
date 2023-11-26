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
    PORT: Joi.number().default(3000)
    
})
  