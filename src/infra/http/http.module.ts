import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { RegisterAdminUseCase } from '@/domain/delivery/application/use-cases/register-admin'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateAdminAccountController } from './controllers/create-admin-account.controller'
import { AuthenticateAdminUseCase } from '@/domain/delivery/application/use-cases/authenticate-admin'
import { AuthenticateAdminController } from './controllers/authenticate-admin.controller'
import { CreateDeliveryManController } from './controllers/create-delivery-man-account.controller'
import { PermissionsModule } from '../permissions/permissions.module'
import { RegisterDeliveryManUseCase } from '@/domain/delivery/application/use-cases/register-delivery-man'
import { GetDeliveryManByIdController } from './controllers/get-delivery-man-by-id.controller'
import { GetDeliveryManByIdUseCase } from '@/domain/delivery/application/use-cases/get-delivery-man-by-id'
import { FetchDeliveryManController } from './controllers/fetch-delivery-man.controller'
import { FetchDeliveryManUseCase } from '@/domain/delivery/application/use-cases/fetch-delivery-man'

@Module({
  imports: [DatabaseModule, CryptographyModule, PermissionsModule],
  controllers: [
    CreateAdminAccountController,
    AuthenticateAdminController,
    CreateDeliveryManController,
    GetDeliveryManByIdController,
    FetchDeliveryManController,
  ],
  providers: [
    RegisterAdminUseCase,
    AuthenticateAdminUseCase,
    RegisterDeliveryManUseCase,
    GetDeliveryManByIdUseCase,
    FetchDeliveryManUseCase,
  ],
})
export class HttpModule {}
