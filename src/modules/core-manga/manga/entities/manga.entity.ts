import { Model, Table, Column, DataType, BelongsTo, ForeignKey, BelongsToMany, BeforeCreate, BeforeUpdate, HasMany  } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { Author } from '../../author/entities/author.entity';
import { Chapter } from '../../chapters/entities';
import { Categorie, MangaCategorie } from '../../categorie/entities';
import { User } from 'src/modules/user-management/users/entities/user.entity';
import { UserFavoriteManga } from '../../user-favorite-manga/entities/user-favorite-manga.entity';




@Table
export class Manga extends Model {

    @ApiProperty({
        example: '5b09dad7-4473-4311-83b2-ab32a48d6023',
        description: 'The ID(uuid) of the manga',
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
        example: 'Naruto',
        description: 'Name of manga to create',
        uniqueItems: true
    })
    @Column({
        allowNull: false,
        type: DataType.TEXT,
        unique: true
    })
    manga_name: string;

    @ApiProperty({
        example: 'MyImage.jpg',
        description: 
        'Cover image of the manga | Max size: ?| Allowed types: png, jpg, jpeg',
    })
    @Column({
        allowNull: true,
        type: DataType.STRING
    })
    cover_image: string;

    @ApiProperty({
        example: 'Moon sovering',
        description: 'The name of the author',
        uniqueItems: true
    })
    @ForeignKey( () => Author )
    author_name: string;

    @ApiProperty({
        example: 'One Piece is a popular manga and anime series written and illustrated by Eiichiro Oda',
        description: 'The description of the manga.',
    })
    @Column({
        allowNull: true,
        type: DataType.TEXT,
    })
    manga_description: string;
    
    @ApiProperty({
        example: true,
        description: 'Show the status of the manga, if status is false manga will be hidde',
        default: true
    })
    @Column({ 
        allowNull: false,
        type: DataType.BOOLEAN,
        defaultValue: true
     })
    isActive: boolean

    @HasMany( () => Chapter )
    chapters: Chapter[]

    @BelongsTo( () => Author, { foreignKey: 'author_name' })
    author: Author

    @BelongsToMany( () => Categorie, () => MangaCategorie )
    categories: Categorie[]

    @BelongsToMany( () => User, () => UserFavoriteManga )
    users: User[]

    @BeforeUpdate
    @BeforeCreate
    static checkNameInsert( instance: Manga ) {
        instance.manga_name = instance.manga_name
            .toLowerCase()
            .replace(/\s+/g, '_')
    }
}

