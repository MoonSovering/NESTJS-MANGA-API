import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Manga } from "src/modules/manga/entities";
import { Categorie } from "./categorie.entity";



@Table
export class MangaCategorie extends Model {

    @ForeignKey( () => Manga )
    mangaId: string;

    @ForeignKey( () => Categorie )
    categorieId: string;

}