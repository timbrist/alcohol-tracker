import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsPositive()
  totalCl: number;

  @IsNumber()
  @IsPositive()
  remainingCl: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  pricePerCl?: number;

  @IsString()
  @IsOptional()
  location?: string;
} 