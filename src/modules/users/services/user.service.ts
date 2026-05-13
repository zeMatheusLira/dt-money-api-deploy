import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { CreateUserDTO, UpdateUserDTO } from '../dto';

@Injectable()
export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async create(data: CreateUserDTO) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new BadRequestException('Email já cadastrado');
    }
    return this.userRepository.create(data);
  }

  async findAll() {
    return this.userRepository.findAll();
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: string, data: UpdateUserDTO) {
    await this.findById(id);
    return this.userRepository.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id);
    return this.userRepository.delete(id);
  }
}
