
import { Manga } from './entities/manga.entity';

export const mangaProviders = [
    {
        provide: 'MANGAS_REPOSITORY',
        useValue: Manga
    },
];