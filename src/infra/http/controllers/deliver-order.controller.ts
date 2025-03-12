import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
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
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { OrderNotFoundError } from '@/domain/delivery/application/use-cases/erros/order-not-found-error'
import { DeliverOrderUseCase } from '@/domain/delivery/application/use-cases/deliver-order'
import { string, z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

const deliverOrderBodySchema = z.object({
  attachmentId: string().uuid(),
})

type DeliverOrderBodySchema = z.infer<typeof deliverOrderBodySchema>

const bodyValidationPipe = new ZodValidationPipe(deliverOrderBodySchema)

@ApiTags('orders')
@ApiBearerAuth()
@Controller('/orders/:id/deliver')
export class DeliverOrderController {
  constructor(private deliverOrder: DeliverOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  @ApiOperation({ summary: 'Deliver order' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Deliver, 'Order'))
  async handle(
    @Body(bodyValidationPipe) body: DeliverOrderBodySchema,
    @Param('id') orderId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { attachmentId } = body
    const userId = user.sub

    const result = await this.deliverOrder.execute({
      deliveryManId: userId,
      attachmentId,
      orderId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case OrderNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
