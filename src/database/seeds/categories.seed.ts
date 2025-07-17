import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Injectable()
export class CategoriesSeed {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async seed() {
    const defaultCategories = [
      'Whiskey',
      'Vodka',
      'Gin',
      'Rum',
      'Tequila',
      'Wine',
      'Beer',
      'Liqueur',
      'Brandy',
      'Cognac',
    ];

    for (const categoryName of defaultCategories) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { name: categoryName },
      });

      if (!existingCategory) {
        const category = this.categoriesRepository.create({
          name: categoryName,
        });
        await this.categoriesRepository.save(category);
        console.log(`Category "${categoryName}" created successfully`);
      } else {
        console.log(`Category "${categoryName}" already exists`);
      }
    }
  }
} 