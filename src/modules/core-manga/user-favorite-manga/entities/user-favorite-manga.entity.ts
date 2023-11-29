import { ForeignKey, Model, Table } from "sequelize-typescript";
import { Manga } from "../../manga/entities";
import { User } from "src/modules/user-management/users/entities/user.entity";

@Table
export class UserFavoriteManga extends Model {

    @ForeignKey( () => Manga )
    mangaId: string;

    @ForeignKey( () => User )
    userId: string;

}
