import { EditDeliveryManUseCase } from '@/domain/delivery/application/use-cases/edit-delivery-man'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeliveryManNotFoundError } from '@/domain/delivery/application/use-cases/erros/delivery-man-not-found-error'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PoliciesGuard } from '@/infra/permissions/policies.guard'
import { CheckPolicies } from '@/infra/permissions/policy.decorator'
import { Action, AppAbility } from '@/infra/permissions/ability.factory'

const editDeliveryManBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
})

type EditDeliveryManBodySchema = z.infer<typeof editDeliveryManBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editDeliveryManBodySchema)

@ApiTags('auth')
@ApiBearerAuth()
@Controller('/accounts/delivery-man/:id')
export class EditDeliveryManController {
  constructor(private editDeliveryMan: EditDeliveryManUseCase) {}

  @Patch()
  @HttpCode(204)
  @ApiOperation({ summary: 'Edit a delivery man data' })
  @ApiBody({
    description: 'Data for delivery man account edit',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'João da Silva' },
        cpf: { type: 'string', example: '12345678900' },
      },
      required: ['name', 'cpf'],
    },
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, 'DeliveryMan'),
  )
  async handle(
    @Body(bodyValidationPipe) body: EditDeliveryManBodySchema,
    @Param('id') deliveryManId: string,
  ) {
    const { name, cpf } = body

    const result = await this.editDeliveryMan.execute({
      deliveryManId,
      cpf,
      name,
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
