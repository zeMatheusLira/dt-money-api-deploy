import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ITransactionRepository } from '../transaction.repository.abstract';
import { CreateTransactionDTO } from '../../../dto/create-transaction.dto';
import { UpdateTransactionDTO } from '../../../dto/update-transaction.dto';

interface TransactionEntity extends CreateTransactionDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class FakeTransactionRepository implements ITransactionRepository {
  private transactions: TransactionEntity[] = [];

  async create(data: CreateTransactionDTO) {
    const transaction: TransactionEntity = {
      ...data,
      id: data.id ?? randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      data: data.data ? new Date(data.data) : new Date(),
    };

    this.transactions.push(transaction);
    return transaction;
  }

  async findAll() {
    return [...this.transactions];
  }

  async findById(id: string) {
    const transaction = this.transactions.find((item) => item.id === id);
    return transaction ?? null;
  }

  async delete(id: string) {
    const index = this.transactions.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException('Transaction not found');
    }

    this.transactions.splice(index, 1);
  }

  async update(id: string, data: UpdateTransactionDTO) {
    const index = this.transactions.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException('Transaction not found');
    }

    const current = this.transactions[index];
    const updatedTransaction: TransactionEntity = {
      ...current,
      ...data,
      updatedAt: new Date(),
      data: data.data ? new Date(data.data) : current.data,
    };

    this.transactions[index] = updatedTransaction;
    return updatedTransaction;
  }
}
