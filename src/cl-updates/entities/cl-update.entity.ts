import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity('cl_updates')
export class ClUpdate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ type: 'real', name: 'old_cl' })
  oldCl: number;

  @Column({ type: 'real', name: 'new_cl' })
  newCl: number;

  @Column({ type: 'real', name: 'difference_cl', generatedType: 'STORED' })
  differenceCl: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedById: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Product, product => product.clUpdates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => User, user => user.clUpdates, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;
} 