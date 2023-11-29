import { BeforeCreate, BeforeUpdate, BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";

import { MangaCategorie } from "./manga-categorie.entity";
import { Manga } from "../../manga/entities";
import { ApiProperty } from "@nestjs/swagger";


@Table
export class Categorie extends Model {

    @ApiProperty({
        example: '7644c040-9348-4ba7-af14-09e43728a594',
        description: 'The ID(uuid) of the category',
        uniqueItems: true
    })
    @Column({
        primaryKey: true,
        allowNull: false,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id: string;

    @ApiProperty({
        example: 'Romance',
        description: 'The name of the category'
    })
    @Column({
        allowNull: false,
        type: DataType.STRING,
        unique: true
    })
    categorie_name: string;

    @ApiProperty({
        example: true,
        description: 'Show the status of the category, if status is false category will be hidde',
        default: true
    })
    @Column({
        allowNull: false,
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    isActive: boolean;

    @BelongsToMany( () => Manga, () => MangaCategorie )
    mangas: Manga[]

    @BeforeUpdate
    @BeforeCreate
    static checkNameInsert( instance: Categorie ){
        instance.categorie_name = instance.categorie_name
            .toUpperCase()
            .replace(/\s+/g, '_')
    }

}
