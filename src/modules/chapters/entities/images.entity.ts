import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Chapter } from "./chapter.entity";

@Table
export class Images extends Model {

    @Column({
        primaryKey: true,
        allowNull: false,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id: string;

    @Column({
        allowNull: false,
        type: DataType.STRING
    })
    image_url: string;

    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    page_number: string;

    @ForeignKey( () => Chapter )
    id_chapter: string

    @BelongsTo( () => Chapter )
    chapter: Chapter;
}