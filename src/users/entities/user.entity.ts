import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { ClUpdate } from '../../cl-updates/entities/cl-update.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ type: 'text', name: 'password_hash' })
  @Exclude()
  passwordHash: string;

  @Column({ 
    type: 'text', 
    default: UserRole.STAFF 
  })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @OneToMany(() => Product, product => product.createdBy)
  products: Product[];

  @OneToMany(() => ClUpdate, clUpdate => clUpdate.updatedBy)
  clUpdates: ClUpdate[];
} 