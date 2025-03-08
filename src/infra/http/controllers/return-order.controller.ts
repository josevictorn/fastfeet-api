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
import { OrderNotFoundError } from '@/domain/delivery/application/use-cases/erros/order-not-found-error'
import { ReturnOrderUseCase } from '@/domain/delivery/application/use-cases/return-order'

@ApiTags('orders')
@ApiBearerAuth()
@Controller('/orders/:id/return-order')
export class ReturnOrderController {
  constructor(private returnOrder: ReturnOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  @ApiOperation({ summary: 'Return order' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Return, 'Order'))
  async handle(@Param('id') orderId: string) {
    const result = await this.returnOrder.execute({
      orderId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case OrderNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
