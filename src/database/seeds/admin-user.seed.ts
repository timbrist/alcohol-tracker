import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../../users/entities/user.entity';

@Injectable()
export class AdminUserSeed {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async seed() {
    // Check if admin user already exists
    const existingAdmin = await this.usersRepository.findOne({
      where: { username: 'admin' },
    });

    if (!existingAdmin) {
      // Hash the password: admin123
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = this.usersRepository.create({
        username: 'admin',
        passwordHash: hashedPassword,
        role: UserRole.ADMIN,
      });

      await this.usersRepository.save(adminUser);
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  }
} 