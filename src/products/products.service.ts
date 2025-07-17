import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createProductDto: CreateProductDto, userId: number, photoUrl?: string) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        createdById: userId,
        photoUrl,
      },
      include: {
        category: true,
        createdBy: true,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        createdBy: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        createdBy: true,
        clUpdates: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, userId: number) {
    const product = await this.findOne(id);
    
    // If remaining_cl is being updated, create a cl_update record
    if (updateProductDto.remainingCl !== undefined && updateProductDto.remainingCl !== product.remainingCl) {
      await this.prisma.clUpdate.create({
        data: {
          product: { connect: { id } },
          oldCl: product.remainingCl,
          newCl: updateProductDto.remainingCl,
          updatedBy: userId ? { connect: { id: userId } } : undefined,
        },
      });
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
        createdBy: true,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Check if exists
    await this.prisma.product.delete({ where: { id } });
  }

  async uploadPhoto(id: number, photoUrl: string) {
    return this.prisma.product.update({
      where: { id },
      data: { photoUrl },
      include: {
        category: true,
        createdBy: true,
      },
    });
  }

  async getLowStock(threshold: number = 10) {
    return this.prisma.product.findMany({
      where: {
        remainingCl: {
          lte: threshold,
          gt: 0,
        },
      },
      orderBy: { remainingCl: 'asc' },
      include: {
        category: true,
        createdBy: true,
      },
    });
  }
} 