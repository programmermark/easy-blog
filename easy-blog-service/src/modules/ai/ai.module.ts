import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { AIWritingController } from './ai-writing.controller';

@Module({
  controllers: [AIController, AIWritingController],
  providers: [AIService],
  exports: [AIService],
})
export class AIModule {}

