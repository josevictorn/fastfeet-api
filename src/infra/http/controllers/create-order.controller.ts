import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { RecipientNotFoundError } from '@/domain/delivery/application/use-cases/erros/recipient-not-found-error'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PoliciesGuard } from '@/infra/permissions/policies.guard'
import { CheckPolicies } from '@/infra/permissions/policy.decorator'
import { Action, AppAbility } from '@/infra/permissions/ability.factory'

const createOrderBodySchema = z.object({
  recipientId: z.string().uuid(),
})

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@ApiTags('orders')
@ApiBearerAuth()
@Controller('/orders')
@UsePipes(new ZodValidationPipe(createOrderBodySchema))
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({
    description: 'Data for order creation',
    schema: {
      type: 'object',
      properties: {
        recipientId: { type: 'string', example: '1' },
      },
      required: ['recipientId'],
    },
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'Order'))
  async handle(@Body() body: CreateOrderBodySchema) {
    const { recipientId } = body

    const result = await this.createOrder.execute({
      recipientId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case RecipientNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
