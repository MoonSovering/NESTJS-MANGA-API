import { Column, ForeignKey, Model, Table } from "sequelize-typescript";

import { Categorie } from "./categorie.entity";
import { Manga } from "../../manga/entities";



@Table
export class MangaCategorie extends Model {

    @ForeignKey( () => Manga )
    mangaId: string;

    @ForeignKey( () => Categorie )
    categorieId: string;

}