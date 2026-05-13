import { Module } from "@nestjs/common";
import { FakeTransactionRepository } from "./infra/repositories/fake/fake.transaction.repository";
import { ITransactionRepository } from "src/modules/transactions/infra/repositories/transaction.repository.abstract";
import { transactionServices } from "./services";
import { transactionsControllers } from "./controllers";

@Module({
  imports: [],
  controllers: [...transactionsControllers],
  providers: [{
    provide: ITransactionRepository,
    useClass: FakeTransactionRepository
  }, ...transactionServices]
})
export class TransactionsModule {}