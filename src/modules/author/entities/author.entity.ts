import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Manga } from "src/modules/manga/entities";



@Table
export class Author extends Model {

    @Column({
        primaryKey: true,
        allowNull: false,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id: string;
    

    @Column({
        allowNull: false,
        type: DataType.TEXT,
        unique: true
    })
    author_name: string;

    @Column({
        type: DataType.TEXT
    })
    profile_image: string;

    @Column({ 
        allowNull: false,
        type: DataType.BOOLEAN,
        defaultValue: true
     })
    status: boolean

    @HasMany( () => Manga )
    manga: Manga[]
}
