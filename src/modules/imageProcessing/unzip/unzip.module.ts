import { Module } from '@nestjs/common';
import { UnzipService } from './unzip.service';


@Module({
  controllers: [],
  providers: [UnzipService],
  exports: [UnzipService]
})
export class UnzipModule {}
