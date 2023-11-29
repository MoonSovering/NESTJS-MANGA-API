import { BeforeCreate, BeforeUpdate, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Manga } from "../../manga/entities";
import { ApiProperty } from "@nestjs/swagger";




@Table
export class Author extends Model {

    @ApiProperty({
        example: '57e0189f-82fa-47e6-b368-603195f23753',
        description: 'The ID(uuid) of the author',
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
        example: 'Rhaenyra doem',
        description: 'Name use by the author',
        uniqueItems: true
    })
    @Column({
        allowNull: false,
        type: DataType.STRING,
        unique: true
    })
    author_name: string;

    @ApiProperty({
        example: 'profileImage.jpg',
        description: 
        'profile image of the author | Max size: ?| Allowed types: png, jpg, jpeg',
    })
    @Column({
        type: DataType.TEXT
    })
    profile_image: string;

    @ApiProperty({
        example: true,
        description: 'Show the status of the author, if status is false author will be hidde',
        default: true
    })
    @Column({ 
        allowNull: false,
        type: DataType.BOOLEAN,
        defaultValue: true
     })
    isActive: boolean

    @HasMany( () => Manga )
    mangas: Manga[]

    @BeforeCreate
    @BeforeUpdate
    static checkNameInsert( instance: Author ){

        instance.author_name = instance.author_name
            .toLowerCase()
            .replace(/\s+/g, '_')

    }
}
