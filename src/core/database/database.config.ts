import { IDatabaseConfigAttributes } from "./interfaces/dbConfig.interface";


export const databaseConfig: IDatabaseConfigAttributes = {

    dialect: process.env.DIALECT,
    host: 'localhost',
    port: 5432,
    username: 'sovering',
    password: 'Urranrell318',
    database: 'sovering',

}