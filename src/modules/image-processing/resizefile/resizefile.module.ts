import { Module } from '@nestjs/common';
import { ResizefileService } from './resizefile.service';

@Module({
  controllers: [],
  providers: [ResizefileService],
  exports: [ResizefileService]
})
export class ResizefileModule {}
