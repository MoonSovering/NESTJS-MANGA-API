import { IsInt, IsPositive } from 'class-validator';
import { UUIDV4 } from 'sequelize';
import { Model, Table, Column, DataType, BelongsTo, ForeignKey  } from 'sequelize-typescript';
// import { v4 as uuid } from 'uuid';
import { Author } from 'src/modules/author/entities/author.entity';

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

    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    chapters: number;

    @ForeignKey( () => Author )
    @IsInt()
    @IsPositive()
    authorId: number;
    
    @Column({ 
        allowNull: false,
        type: DataType.BOOLEAN,
        defaultValue: true
     })
    status: boolean

    @BelongsTo( () => Author )
    author: Author

}
