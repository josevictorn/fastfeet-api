import { GetDeliveryManByIdUseCase } from '@/domain/delivery/application/use-cases/get-delivery-man-by-id'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common'
import { DeliveryManPresenter } from '../presenters/delivery-man-presenter'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CheckPolicies } from '@/infra/permissions/policy.decorator'
import { Action, AppAbility } from '@/infra/permissions/ability.factory'
import { PoliciesGuard } from '@/infra/permissions/policies.guard'

@ApiTags('auth')
@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@Controller('/accounts/delivery-man/:id')
export class GetDeliveryManByIdController {
  constructor(private getDeliveryManById: GetDeliveryManByIdUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Get a delivery man data' })
  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'abcdefg1234hijk56789' },
        cpf: { type: 'string', example: '111.111.111-11' },
        name: { type: 'string', example: 'John Doe' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'DeliveryMan'),
  )
  async handle(@Param('id') id: string) {
    const result = await this.getDeliveryManById.execute({ id })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }

    return {
      deliveryMan: DeliveryManPresenter.toHTTP(result.value.deliveryMan),
    }
  }
}
