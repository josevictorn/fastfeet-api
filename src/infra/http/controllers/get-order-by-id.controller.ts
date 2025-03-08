import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CheckPolicies } from '@/infra/permissions/policy.decorator'
import { Action, AppAbility } from '@/infra/permissions/ability.factory'
import { PoliciesGuard } from '@/infra/permissions/policies.guard'
import { GetOrderByIdUseCase } from '@/domain/delivery/application/use-cases/get-order-by-id'
import { OrderNotFoundError } from '@/domain/delivery/application/use-cases/erros/order-not-found-error'
import { OrderPresenter } from '../presenters/order-presenter'
import { OrderStatus } from '@/core/enums/order-status'

@ApiTags('orders')
@ApiBearerAuth()
@Controller('/orders/:id')
export class GetOrderByIdController {
  constructor(private getOrderById: GetOrderByIdUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get a order data' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'abcdefg1234hijk56789' },
        code: { type: 'string', example: '#123ABC01' },
        status: {
          type: 'string',
          example: OrderStatus.PENDING,
        },
        deliveryManId: { type: 'string', example: 'abcdefg1234hijk56789' },
        recipientId: { type: 'string', example: 'abcdefg1234hijk56789' },
        createdAt: { type: 'string', example: new Date().toISOString() },
        updatedAt: { type: 'string', example: new Date().toISOString() },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Order'))
  async handle(@Param('id') id: string) {
    const result = await this.getOrderById.execute({ id })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case OrderNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      order: OrderPresenter.toHTTP(result.value.order),
    }
  }
}
