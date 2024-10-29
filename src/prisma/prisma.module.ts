import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
