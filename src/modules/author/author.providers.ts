import { AUTHOR_REPOSITORY } from "src/constants";
import { Author } from "./entities/author.entity";


export const authorProvider = [
    {
        provide: AUTHOR_REPOSITORY,
        useValue: Author
    }
]