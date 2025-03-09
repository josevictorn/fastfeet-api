import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { OrderPresenter } from '../presenters/order-presenter'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { OrderStatus } from '@prisma/client'
import { PoliciesGuard } from '@/infra/permissions/policies.guard'
import { FetchOrdersFromRecipientUseCase } from '@/domain/delivery/application/use-cases/fetch-orders-from-recipient'
import { CheckPolicies } from '@/infra/permissions/policy.decorator'
import { Action, AppAbility } from '@/infra/permissions/ability.factory'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('recipients')
@ApiBearerAuth()
@Controller('/recipients/:id/orders')
export class FetchOrdersFromRecipientController {
  constructor(
    private fetchOrdersFromRecipient: FetchOrdersFromRecipientUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Fetch orders from a recipient' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'array',
      items: {
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
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Order'))
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('id') recipientId: string,
  ) {
    const result = await this.fetchOrdersFromRecipient.execute({
      page,
      recipientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const orders = result.value.orders

    return { orders: orders.map(OrderPresenter.toHTTP) }
  }
}
