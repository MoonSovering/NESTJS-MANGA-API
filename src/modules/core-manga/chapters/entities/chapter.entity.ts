import { BeforeCreate, BeforeUpdate, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";

import { Images } from "./images.entity";
import { Manga } from "../../manga/entities";
import { ApiProperty } from "@nestjs/swagger";


@Table
export class Chapter extends Model{

    @ApiProperty({
        example: '8e09371d-5767-420d-8946-de24bebc3479',
        description: 'The ID(uuid) of the chapter',
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
        example: 10,
        description: 'Number of the chapter'
    })
    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    chapter_number: string;

    @ApiProperty({
        example: 'Pilot',
        description: 'Name of the chapter'
    })
    @Column({
        allowNull: false,
        type: DataType.STRING,
        defaultValue: 'unknown'
    })
    chapter_name: string;

    @ApiProperty({
        example: '6bc2b97b-02ba-44b6-b921-8acceaa1ab6a',
        description: 'The ID(uuid) of the manga',
        uniqueItems: true
    })
    @ForeignKey( () => Manga )
    id_manga: string

    @BelongsTo( () => Manga )
    chapters: Chapter

    @HasMany( ()=> Images )
    images: Images[]

    @BeforeUpdate
    @BeforeCreate
    static checkNameInsert( instance: Chapter ) {
        instance.chapter_number = instance.chapter_number
            .toLowerCase()
            .replace(/\s+/g, '_')

        instance.chapter_name = instance.chapter_name
            .toLowerCase()
            .replace(/\s+/g, '_')
    }
}
