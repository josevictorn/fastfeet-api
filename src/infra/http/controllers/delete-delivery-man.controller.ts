import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { DeliveryManNotFoundError } from '@/domain/delivery/application/use-cases/erros/delivery-man-not-found-error'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PoliciesGuard } from '@/infra/permissions/policies.guard'
import { CheckPolicies } from '@/infra/permissions/policy.decorator'
import { Action, AppAbility } from '@/infra/permissions/ability.factory'
import { DeleteDeliveryManUseCase } from '@/domain/delivery/application/use-cases/delete-delivery-man'

@ApiTags('auth')
@ApiBearerAuth()
@Controller('/accounts/delivery-man/:id')
export class DeleteDeliveryManController {
  constructor(private deleteDeliveryMan: DeleteDeliveryManUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a delivery man' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, 'DeliveryMan'),
  )
  async handle(@Param('id') deliveryManId: string) {
    const result = await this.deleteDeliveryMan.execute({
      deliveryManId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DeliveryManNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
