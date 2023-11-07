import { BeforeCreate, BeforeUpdate, BeforeValidate, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
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

    @BeforeCreate
    @BeforeUpdate
    static checkNameInsert( instance: Author ){

        instance.author_name = instance.author_name
            .toLowerCase()
            .replace(/\s+/g, '_')

    }
}
