import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ClUpdatesService } from './cl-updates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('cl-updates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClUpdatesController {
  constructor(private readonly clUpdatesService: ClUpdatesService) {}

  @Get()
  findAll() {
    return this.clUpdatesService.findAll();
  }

  @Get('recent')
  getRecentUpdates(@Query('limit') limit?: string) {
    const limitValue = limit ? parseInt(limit, 10) : 10;
    return this.clUpdatesService.getRecentUpdates(limitValue);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.clUpdatesService.findByProduct(+productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clUpdatesService.findOne(+id);
  }
} 