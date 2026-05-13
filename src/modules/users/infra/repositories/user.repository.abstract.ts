import { CreateUserDTO, UpdateUserDTO } from '../../dto';

export abstract class IUserRepository {
  abstract create(data: CreateUserDTO);
  abstract findAll();
  abstract findById(id: string);
  abstract findByEmail(email: string);
  abstract update(id: string, data: UpdateUserDTO);
  abstract delete(id: string);
}
