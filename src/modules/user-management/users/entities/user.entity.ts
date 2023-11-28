import { BeforeCreate, BeforeUpdate, Column, DataType, Model, Table } from "sequelize-typescript";


@Table
export class User extends Model {
    @Column({
        primaryKey: true,
        allowNull: false,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    id: string;

    @Column({
        allowNull: true,
        type: DataType.STRING,
        unique: true
    })
    username: string;

    @Column({
        allowNull: false,
        type: DataType.STRING,
        unique: true
    })
    email: string;

    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    hash_password: string;

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
