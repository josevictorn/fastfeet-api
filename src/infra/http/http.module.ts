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
import { FetchRecipientsController } from './controllers/fetch-recipients.controller'
import { FetchRecipientsUseCase } from '@/domain/delivery/application/use-cases/fetch-recipients'
import { DeleteRecipientController } from './controllers/delete-recipient.controller'
import { DeleteRecipientUseCase } from '@/domain/delivery/application/use-cases/delete-recipient'
import { EditRecipientController } from './controllers/edit-recipient.controller'
import { EditRecipientUseCase } from '@/domain/delivery/application/use-cases/edit-recipient'
import { CreateOrderController } from './controllers/create-order.controller'
import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order'
import { PickUpOrderController } from './controllers/pick-up-order.controller'
import { PickUpOrderUseCase } from '@/domain/delivery/application/use-cases/pick-up-order'
import { ReturnOrderController } from './controllers/return-order.controller'
import { ReturnOrderUseCase } from '@/domain/delivery/application/use-cases/return-order'
import { GetOrderByIdController } from './controllers/get-order-by-id.controller'
import { GetOrderByIdUseCase } from '@/domain/delivery/application/use-cases/get-order-by-id'
import { FetchOrdersController } from './controllers/fetch-orders.controller'
import { FetchOrdersUseCase } from '@/domain/delivery/application/use-cases/fetch-orders'
import { FetchOrdersFromDeliveryManController } from './controllers/fetch-orders-from-delivery-man.controller'
import { FetchOrdersFromDeliveryManUseCase } from '@/domain/delivery/application/use-cases/fetch-orders-from-delivery-man'

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
    FetchRecipientsController,
    DeleteRecipientController,
    EditRecipientController,
    CreateOrderController,
    PickUpOrderController,
    ReturnOrderController,
    GetOrderByIdController,
    FetchOrdersController,
    FetchOrdersFromDeliveryManController,
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
    FetchRecipientsUseCase,
    DeleteRecipientUseCase,
    EditRecipientUseCase,
    CreateOrderUseCase,
    PickUpOrderUseCase,
    ReturnOrderUseCase,
    GetOrderByIdUseCase,
    FetchOrdersUseCase,
    FetchOrdersFromDeliveryManUseCase,
  ],
})
export class HttpModule {}
