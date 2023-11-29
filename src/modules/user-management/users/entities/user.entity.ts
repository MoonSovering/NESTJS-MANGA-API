import { ApiProperty } from "@nestjs/swagger";
import { BeforeCreate, BeforeUpdate, Column, DataType, Model, Table } from "sequelize-typescript";


@Table
export class User extends Model {

    @ApiProperty({
        example: '57e0189f-82fa-47e6-b368-603195f23712',
        description: 'The ID(uuid) of the user',
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
        example: 'brilliant',
        description: 'Username of the user',
        uniqueItems: true
    })
    @Column({
        allowNull: true,
        type: DataType.STRING,
        unique: true
    })
    username: string;

    @ApiProperty({
        example: 'test@test.com',
        description: 'Email of the user',
        uniqueItems: true
    })
    @Column({
        allowNull: false,
        type: DataType.STRING,
        unique: true
    })
    email: string;

    @ApiProperty({
        example: 'mypasswordone',
        description: 'Password of the user',
    })
    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    hash_password: string;

    @ApiProperty({
        example: 'Admin',
        description: 'Role of the user in the system',
        default: 'user'
    })
    @Column({
        allowNull: false,
        type: DataType.STRING,
        defaultValue: 'user'
    })
    role: string;

    @BeforeUpdate
    @BeforeCreate
    static checkNameInsert( instance: User ) {
        instance.username = instance.username
            .toLowerCase()
            .replace(/\s+/g, '_')
        
        instance.email = instance.email
            .toLowerCase()
    }
}
