import { Module } from '@nestjs/common';
import { ClUpdatesService } from './cl-updates.service';
import { ClUpdatesController } from './cl-updates.controller';

@Module({
  controllers: [ClUpdatesController],
  providers: [ClUpdatesService],
  exports: [ClUpdatesService],
})
export class ClUpdatesModule {} 