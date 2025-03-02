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
import { EditDeliveryManController } from './controllers/edit-delivery-man.controller'
import { EditDeliveryManUseCase } from '@/domain/delivery/application/use-cases/edit-delivery-man'
import { DeleteDeliveryManController } from './controllers/delete-delivery-man.controller'
import { DeleteDeliveryManUseCase } from '@/domain/delivery/application/use-cases/delete-delivery-man'
import { AuthenticateDeliveryManController } from './controllers/authenticate-delivery-man.controller'
import { AuthenticateDeliveryManUseCase } from '@/domain/delivery/application/use-cases/authenticate-delivery-man'
import { CreateRecipientContoller } from './controllers/create-recipient.controller'
import { CreateRecipientUseCase } from '@/domain/delivery/application/use-cases/create-recipient'
import { GetRecipientByIdController } from './controllers/get-recipient-by-id.controller'
import { GetRecipientByIdUseCase } from '@/domain/delivery/application/use-cases/get-recipient-by-id'

@Module({
  imports: [DatabaseModule, CryptographyModule, PermissionsModule],
  controllers: [
    CreateAdminAccountController,
    AuthenticateAdminController,
    CreateDeliveryManController,
    AuthenticateDeliveryManController,
    GetDeliveryManByIdController,
    FetchDeliveryManController,
    EditDeliveryManController,
    DeleteDeliveryManController,
    CreateRecipientContoller,
    GetRecipientByIdController,
  ],
  providers: [
    RegisterAdminUseCase,
    AuthenticateAdminUseCase,
    RegisterDeliveryManUseCase,
    AuthenticateDeliveryManUseCase,
    GetDeliveryManByIdUseCase,
    FetchDeliveryManUseCase,
    EditDeliveryManUseCase,
    DeleteDeliveryManUseCase,
    CreateRecipientUseCase,
    GetRecipientByIdUseCase,
  ],
})
export class HttpModule {}
