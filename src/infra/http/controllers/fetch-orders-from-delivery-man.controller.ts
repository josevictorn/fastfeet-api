import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Controller,
  Get,
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
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchOrdersFromDeliveryManUseCase } from '@/domain/delivery/application/use-cases/fetch-orders-from-delivery-man'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('delivery-man')
@ApiBearerAuth()
@Controller('/delivery-man/orders')
export class FetchOrdersFromDeliveryManController {
  constructor(
    private fetchOrdersFromDeliveryMan: FetchOrdersFromDeliveryManUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Fetch orders from delivery man data' })
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
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    const result = await this.fetchOrdersFromDeliveryMan.execute({
      page,
      deliveryManId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const orders = result.value.orders

    return { orders: orders.map(OrderPresenter.toHTTP) }
  }
}
