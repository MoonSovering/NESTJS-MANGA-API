import { Column, DataType, Model, Table } from "sequelize-typescript";



@Table
export class Author extends Model {

    @Column({ 
        primaryKey: true, 
        autoIncrement: true,
        allowNull: false,
        type: DataType.NUMBER,
    })
    id: number

    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    name: string

    @Column({ 
        allowNull: false,
        type: DataType.BOOLEAN,
        defaultValue: true
     })
    status: boolean

}
