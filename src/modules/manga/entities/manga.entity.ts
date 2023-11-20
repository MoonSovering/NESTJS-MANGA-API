import { Model, Table, Column, DataType, BelongsTo, ForeignKey, BelongsToMany, BeforeCreate, BeforeUpdate, BeforeValidate, HasMany  } from 'sequelize-typescript';

import { Author } from 'src/modules/author/entities/author.entity';
import { Categorie, MangaCategorie } from 'src/modules/categorie/entities';
import { Chapter } from 'src/modules/chapters/entities/chapter.entity';


@Table
export class Manga extends Model {

    @Column({
        primaryKey: true,
        allowNull: false,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id: string;
    
    @Column({
        allowNull: false,
        type: DataType.TEXT

    })
    manga_name: string;

    // @Column({
    //     allowNull: false,
    //     type: DataType.INTEGER
    // })
    // chapters: number;

    @Column({
        allowNull: true,
        type: DataType.STRING
    })
    cover_image: string;

    @ForeignKey( () => Author )
    authorId: string;
    
    @Column({ 
        allowNull: false,
        type: DataType.BOOLEAN,
        defaultValue: true
     })
    isActive: boolean

    @HasMany( () => Chapter )
    chapters: Chapter[]

    @BelongsTo( () => Author, { foreignKey: 'authorId' })
    author: Author

    @BelongsToMany( () => Categorie, () => MangaCategorie )
    categories: Categorie[]


    @BeforeUpdate
    @BeforeCreate
    static checkNameInsert( instance: Manga ) {
        instance.manga_name = instance.manga_name
            .toLowerCase()
            .replace(/\s+/g, '_')
    }
}

