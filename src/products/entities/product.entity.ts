import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { ClUpdate } from '../../cl-updates/entities/cl-update.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number;

  @Column({ type: 'real', name: 'total_cl' })
  totalCl: number;

  @Column({ type: 'real', name: 'remaining_cl' })
  remainingCl: number;

  @Column({ type: 'real', name: 'price_per_cl', nullable: true })
  pricePerCl: number;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl: string;

  @Column({ name: 'created_by', nullable: true })
  createdById: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Category, category => category.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => User, user => user.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany(() => ClUpdate, clUpdate => clUpdate.product, { cascade: true })
  clUpdates: ClUpdate[];
} 