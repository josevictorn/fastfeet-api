import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PoliciesGuard } from '@/infra/permissions/policies.guard'
import { CheckPolicies } from '@/infra/permissions/policy.decorator'
import { Action, AppAbility } from '@/infra/permissions/ability.factory'
import { PickUpOrderUseCase } from '@/domain/delivery/application/use-cases/pick-up-order'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeliveryManNotFoundError } from '@/domain/delivery/application/use-cases/erros/delivery-man-not-found-error'
import { OrderNotFoundError } from '@/domain/delivery/application/use-cases/erros/order-not-found-error'

@ApiTags('orders')
@ApiBearerAuth()
@Controller('/orders/:id/pick-up')
export class PickUpOrderController {
  constructor(private pickUpOrder: PickUpOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  @ApiOperation({ summary: 'Pick up order' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.PickUp, 'Order'))
  async handle(@Param('id') orderId: string, @CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.pickUpOrder.execute({
      deliveryManId: userId,
      orderId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case OrderNotFoundError:
          throw new NotFoundException(error.message)
        case DeliveryManNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
