import { IsNumber, IsNotEmpty, IsOptional, IsString, Min, IsPositive } from 'class-validator';

export class CreateClUpdateDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  oldCl?: number;

  @IsNumber()
  @IsPositive()
  newCl: number;

  @IsString()
  @IsOptional()
  note?: string;
} 