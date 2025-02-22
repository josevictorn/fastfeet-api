import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { RegisterAdminUseCase } from '@/domain/delivery/aplication/use-cases/register-admin'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateAdminAccountController } from './controllers/create-admin-account.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAdminAccountController],
  providers: [RegisterAdminUseCase],
})
export class HttpModule {}
