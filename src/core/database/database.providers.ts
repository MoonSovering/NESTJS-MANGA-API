import { Sequelize } from "sequelize-typescript";
import { databaseConfig } from "./database.config";
import { Manga } from "src/modules/manga/entities/manga.entity";
import { Author } from "src/modules/author/entities/author.entity";
import { SEQUELIZE } from "src/constants";


export const databaseProviders = [
    {
        provide: SEQUELIZE,
        useFactory: async () => {
            const sequelize = new Sequelize(databaseConfig);
            sequelize.addModels([Manga, Author]);
            await sequelize.sync();
            return sequelize;
        },
    },
];