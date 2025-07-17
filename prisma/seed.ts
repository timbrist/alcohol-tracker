import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'admin' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.user.create({
      data: {
        username: 'admin',
        passwordHash: hashedPassword,
        role: UserRole.admin,
      },
    });
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }

  // Create default categories
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
    const existingCategory = await prisma.category.findUnique({
      where: { name: categoryName },
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: { name: categoryName },
      });
      console.log(`Category "${categoryName}" created successfully`);
    } else {
      console.log(`Category "${categoryName}" already exists`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 