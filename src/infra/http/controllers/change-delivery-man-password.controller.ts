import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
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
import { ChangeDeliveryManPasswordUseCase } from '@/domain/delivery/application/use-cases/change-delivery-man-password'
import { PoliciesGuard } from '@/infra/permissions/policies.guard'
import { CheckPolicies } from '@/infra/permissions/policy.decorator'
import { Action, AppAbility } from '@/infra/permissions/ability.factory'
import { DeliveryManNotFoundError } from '@/domain/delivery/application/use-cases/erros/delivery-man-not-found-error'

const changeDeliveryManPasswordBodySchema = z.object({
  password: z.string(),
})

type ChangeDeliveryManPasswordBodySchema = z.infer<
  typeof changeDeliveryManPasswordBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(
  changeDeliveryManPasswordBodySchema,
)

@ApiTags('auth')
@ApiBearerAuth()
@Controller('/accounts/delivery-man/:id/change-password')
export class ChangeDeliveryManPasswordController {
  constructor(
    private changeDeliveryManPassword: ChangeDeliveryManPasswordUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  @ApiOperation({ summary: 'Change delivery man password' })
  @ApiBody({
    description: 'Data for changing delivery man password',
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string', example: 'senhaSecreta123' },
      },
    },
  })
  @ApiResponse({
    status: 204,
    description: 'Delivery man password changed successfully.',
  })
  @ApiResponse({ status: 404, description: 'Delivery man not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, 'DeliveryMan'),
  )
  async handle(
    @Body(bodyValidationPipe) body: ChangeDeliveryManPasswordBodySchema,
    @Param('id') deliveryManId: string,
  ) {
    const { password } = body

    const result = await this.changeDeliveryManPassword.execute({
      password,
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
