import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ description: 'Email único', example: 'joao@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha', example: 'senha123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateUserDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
