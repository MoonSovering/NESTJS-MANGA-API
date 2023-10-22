import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaController } from './manga.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { mangaProviders } from './manga.providers';

@Module({
  controllers: [MangaController],
  imports: [DatabaseModule],
  providers: [ 
    MangaService,
    ...mangaProviders
    ]
})
export class MangaModule {}
