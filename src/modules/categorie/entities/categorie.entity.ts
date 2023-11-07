import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Manga } from "src/modules/manga/entities";
import { MangaCategorie } from "./manga-categorie.entity";


@Table
export class Categorie extends Model {

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
    categorie_name: string;


    @Column({
        allowNull: false,
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    status: boolean;

    @BelongsToMany( () => Manga, () => MangaCategorie )
    mangas: Manga[]

}