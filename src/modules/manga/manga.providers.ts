
import { MANGA_REPOSITORY } from 'src/constants';
import { Manga } from './entities/manga.entity';

export const mangaProviders = [
    {
        provide: MANGA_REPOSITORY,
        useValue: Manga
    },
];