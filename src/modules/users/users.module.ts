import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { FakeUserRepository } from './infra/repositories/fake/fake.user.repository';
import { IUserRepository } from './infra/repositories/user.repository.abstract';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    { provide: IUserRepository, useClass: FakeUserRepository },
  ],
})
export class UsersModule {}
