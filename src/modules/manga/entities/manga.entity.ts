import { Model, Table, Column } from 'sequelize-typescript';

@Table
export class Manga extends Model {

    @Column
    name: string;

    @Column
    chapters: number
}
