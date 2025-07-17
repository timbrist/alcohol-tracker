import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserSeed } from './seeds/admin-user.seed';
import { CategoriesSeed } from './seeds/categories.seed';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category])],
  providers: [AdminUserSeed, CategoriesSeed],
  exports: [AdminUserSeed, CategoriesSeed],
})
export class DatabaseModule {} 