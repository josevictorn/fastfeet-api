import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { RegisterAdminUseCase } from '@/domain/delivery/application/use-cases/register-admin'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateAdminAccountController } from './controllers/create-admin-account.controller'
import { AuthenticateAdminUseCase } from '@/domain/delivery/application/use-cases/authenticate-admin'
import { AuthenticateAdminController } from './controllers/authenticate-admin.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAdminAccountController, AuthenticateAdminController],
  providers: [RegisterAdminUseCase, AuthenticateAdminUseCase],
})
export class HttpModule {}
