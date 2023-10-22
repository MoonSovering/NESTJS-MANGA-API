import { Sequelize } from "sequelize-typescript";
import { databaseConfig } from "./database.config";
import { Manga } from "src/modules/manga/entities/manga.entity";


export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize(databaseConfig);
            sequelize.addModels([Manga]);
            await sequelize.sync();
            return sequelize;
        },
    },
];