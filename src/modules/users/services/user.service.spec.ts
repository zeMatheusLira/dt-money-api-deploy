import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';

describe('UserService', () => {
  let service: UserService;
  let repository: IUserRepository;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: IUserRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<IUserRepository>(IUserRepository);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve criar usuário', async () => {
    const dto = { name: 'João', email: 'joao@test.com', password: '123456' };
    const result = { id: '1', ...dto, createdAt: new Date(), updatedAt: new Date() };
    
    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(result);

    expect(await service.create(dto)).toEqual(result);
  });

  it('deve lançar erro se email existe', async () => {
    const dto = { name: 'João', email: 'joao@test.com', password: '123456' };
    mockRepository.findByEmail.mockResolvedValue({ id: '1' });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('deve buscar usuário por ID', async () => {
    const user = { id: '1', name: 'João', email: 'joao@test.com', createdAt: new Date(), updatedAt: new Date() };
    mockRepository.findById.mockResolvedValue(user);

    expect(await service.findById('1')).toEqual(user);
  });

  it('deve lançar erro se usuário não existe', async () => {
    mockRepository.findById.mockResolvedValue(null);
    await expect(service.findById('999')).rejects.toThrow(NotFoundException);
  });

  it('deve listar usuários', async () => {
    const users = [{ id: '1', name: 'João', email: 'joao@test.com', createdAt: new Date(), updatedAt: new Date() }];
    mockRepository.findAll.mockResolvedValue(users);

    expect(await service.findAll()).toEqual(users);
  });

  it('deve atualizar usuário', async () => {
    const user = { id: '1', name: 'João', email: 'joao@test.com', createdAt: new Date(), updatedAt: new Date() };
    const updated = { ...user, name: 'João Silva' };
    
    mockRepository.findById.mockResolvedValue(user);
    mockRepository.update.mockResolvedValue(updated);

    expect(await service.update('1', { name: 'João Silva' })).toEqual(updated);
  });

  it('deve deletar usuário', async () => {
    const user = { id: '1', name: 'João', email: 'joao@test.com', createdAt: new Date(), updatedAt: new Date() };
    
    mockRepository.findById.mockResolvedValue(user);
    mockRepository.delete.mockResolvedValue(user);

    expect(await service.delete('1')).toEqual(user);
  });
});
