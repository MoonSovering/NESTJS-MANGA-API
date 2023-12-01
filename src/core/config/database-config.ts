import { ConfigService } from "@nestjs/config";
import { Dialect } from "sequelize";


export const databaseConfigFactory = (configService: ConfigService) => ({
  dialect: 'postgres' as Dialect,
  port: +configService.get('DATABASE_PORT'),
  host: configService.get('DATABASE_HOST'),
  username: configService.get('DATABASE_USER'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  ssl: true,
  synchronize: true,
  autoLoadModels: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})
