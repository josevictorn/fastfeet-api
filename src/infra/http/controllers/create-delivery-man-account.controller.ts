import { Action, AppAbility } from '@/infra/permissions/ability.factory'
import { PoliciesGuard } from '@/infra/permissions/policies.guard'
import { CheckPolicies } from '@/infra/permissions/policy.decorator'
import { Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('auth')
@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@Controller('/accounts/delivery-man')
export class CreateDeliveryManController {
  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'DeliveryMan'),
  )
  async handle() {
    return 'Hello world'
  }
}
