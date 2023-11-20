import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Manga } from "src/modules/manga/entities";
import { Images } from "./images.entity";


@Table
export class Chapter extends Model{


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
    chapter_number: string;

    @Column({
        allowNull: false,
        type: DataType.STRING,
        defaultValue: 'unknown'
    })
    chapter_name: string;

    @ForeignKey( () => Manga )
    id_manga: string

    @BelongsTo( () => Manga )
    chapters: Chapter

    @HasMany( ()=> Images )
    images: Images[]
}
