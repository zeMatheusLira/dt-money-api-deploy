import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../user.repository.abstract';
import { CreateUserDTO, UpdateUserDTO } from '../../../dto';

interface UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class FakeUserRepository implements IUserRepository {
  private users: UserEntity[] = [];

  async create(data: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user: UserEntity = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    return this.users.map(({ password, ...user }) => user);
  }

  async findById(id: string) {
    const user = this.users.find((item) => item.id === id);
    if (!user) {
      return null;
    }

    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    const user = this.users.find((item) => item.email === email);
    if (!user) {
      return null;
    }

    const { password, ...result } = user;
    return result;
  }

  async update(id: string, data: UpdateUserDTO) {
    const index = this.users.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const current = this.users[index];
    const password = data.password
      ? await bcrypt.hash(data.password, 10)
      : current.password;

    const updatedUser: UserEntity = {
      ...current,
      name: data.name ?? current.name,
      email: data.email ?? current.email,
      password,
      updatedAt: new Date(),
    };

    this.users[index] = updatedUser;
    const { password: _, ...result } = updatedUser;
    return result;
  }

  async delete(id: string) {
    const index = this.users.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const [deletedUser] = this.users.splice(index, 1);
    const { password, ...result } = deletedUser;
    return result;
  }
}
