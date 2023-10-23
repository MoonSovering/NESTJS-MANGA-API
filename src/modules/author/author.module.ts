import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { DatabaseModule } from 'src/core/database/database.module';

@Module({
  controllers: [AuthorController],
  providers: [AuthorService],
  imports: [DatabaseModule]
})
export class AuthorModule {}
