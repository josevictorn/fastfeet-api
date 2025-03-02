import { GetRecipientByIdUseCase } from '@/domain/delivery/application/use-cases/get-recipient-by-id'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { RecipientPresenter } from '../presenters/recipient-presenter'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CheckPolicies } from '@/infra/permissions/policy.decorator'
import { Action, AppAbility } from '@/infra/permissions/ability.factory'
import { PoliciesGuard } from '@/infra/permissions/policies.guard'
import { RecipientNotFoundError } from '@/domain/delivery/application/use-cases/erros/recipient-not-found-error'

@ApiTags('recipients')
@ApiBearerAuth()
@Controller('/recipients/:id')
export class GetRecipientByIdController {
  constructor(private getRecipientById: GetRecipientByIdUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get a recipient data' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'abcdefg1234hijk56789' },
        name: { type: 'string', example: 'João da Silva' },
        email: { type: 'string', example: 'joaosilva@email.com' },
        street: { type: 'string', example: 'Rua das Flores' },
        complement: { type: 'string', example: 'Apto 101' },
        number: { type: 'number', example: 123 },
        city: { type: 'string', example: 'São Paulo' },
        state: { type: 'string', example: 'SP' },
        zipCode: { type: 'string', example: '12345-678' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  @ApiResponse({ status: 404, description: 'Recipient not found.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'DeliveryMan'),
  )
  async handle(@Param('id') id: string): Promise<{
    deliveryMan: {
      id: string
      email: string
      name: string
      street: string
      number: number
      complement: string | null | undefined
      city: string
      state: string
      zipCode: string
    }
  }> {
    const result = await this.getRecipientById.execute({ id })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case RecipientNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      deliveryMan: RecipientPresenter.toHTTP(result.value.recipient),
    }
  }
}
