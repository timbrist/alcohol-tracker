import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClUpdateDto } from './dto/create-cl-update.dto';

@Injectable()
export class ClUpdatesService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createClUpdateDto: CreateClUpdateDto, userId: number) {
    return this.prisma.clUpdate.create({
      data: {
        product: { connect: { id: createClUpdateDto.productId } },
        oldCl: createClUpdateDto.oldCl || 0,
        newCl: createClUpdateDto.newCl,
        note: createClUpdateDto.note,
        updatedBy: userId ? { connect: { id: userId } } : undefined,
      },
      include: {
        product: true,
        updatedBy: true,
      },
    });
  }

  async findAll() {
    return this.prisma.clUpdate.findMany({
      include: {
        product: true,
        updatedBy: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findByProduct(productId: number) {
    return this.prisma.clUpdate.findMany({
      where: { productId },
      include: {
        updatedBy: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const clUpdate = await this.prisma.clUpdate.findUnique({
      where: { id },
      include: {
        product: true,
        updatedBy: true,
      },
    });
    if (!clUpdate) {
      throw new NotFoundException(`CL Update with ID ${id} not found`);
    }
    return clUpdate;
  }

  async getRecentUpdates(limit: number = 10) {
    return this.prisma.clUpdate.findMany({
      include: {
        product: true,
        updatedBy: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
  }
} 