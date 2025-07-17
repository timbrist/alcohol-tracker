import { IsString, IsNotEmpty, MinLength, IsEnum } from 'class-validator';

enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole = UserRole.STAFF;
} 