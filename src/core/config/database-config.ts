import { ConfigService } from "@nestjs/config";
import { Dialect } from "sequelize";


export const databaseConfigFactory = (configService: ConfigService) => ({
    dialect: 'postgres' as Dialect,
    port: +configService.get('DBPORT'),
    username: configService.get('DBUSER'),
    password: configService.get('DBPASSWORD'),
    database: configService.get('DATABASE'),
    synchronize: true,
    autoLoadModels: true
  })