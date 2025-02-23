import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { RegisterAdminUseCase } from '@/domain/delivery/application/use-cases/register-admin'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateAdminAccountController } from './controllers/create-admin-account.controller'
import { AuthenticateAdminUseCase } from '@/domain/delivery/application/use-cases/authenticate-admin'
import { AuthenticateAdminController } from './controllers/authenticate-admin.controller'
import { CreateDeliveryManController } from './controllers/create-delivery-man-account.controller'
import { PermissionsModule } from '../permissions/permissions.module'

@Module({
  imports: [DatabaseModule, CryptographyModule, PermissionsModule],
  controllers: [
    CreateAdminAccountController,
    AuthenticateAdminController,
    CreateDeliveryManController,
  ],
  providers: [RegisterAdminUseCase, AuthenticateAdminUseCase],
})
export class HttpModule {}
