import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Chapter } from "./chapter.entity";
import { ApiProperty } from "@nestjs/swagger";

@Table
export class Images extends Model {

    @ApiProperty({
        example: '6fbc1ea3-0115-4490-921e-8a7475727640',
        description: 'The ID(uuid) of the image',
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
        example: 'https//:myimage.upload.jpg',
        description: 'Url of the imagen',
        uniqueItems: true
    })
    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    image_url: string;

    @ApiProperty({
        example: 2,
        description: 'Number of one page in the chapter',
        uniqueItems: true
    })
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    page_number: number;

    @ApiProperty({
        example: '77e9284c-d89f-43fb-9121-eda80b9c2e08',
        description: 'The ID(uuid) of the chapter',
        uniqueItems: true
    })
    @ForeignKey( () => Chapter )
    id_chapter: string

    @BelongsTo( () => Chapter )
    chapter: Chapter;

}