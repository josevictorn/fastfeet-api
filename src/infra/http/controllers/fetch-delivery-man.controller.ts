import { FetchDeliveryManUseCase } from '@/domain/delivery/application/use-cases/fetch-delivery-man'
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeliveryManPresenter } from '../presenters/delivery-man-presenter'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { PoliciesGuard } from '@/infra/permissions/policies.guard'
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

@ApiTags('auth')
@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@Controller('/accounts/delivery-man')
export class FetchDeliveryManController {
  constructor(private fetchDeliveryMan: FetchDeliveryManUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Fetch delivery man data' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'string', example: 'abcdefg1234hijk56789' },
          cpf: { type: 'string', example: '111.111.111-11' },
          name: { type: 'string', example: 'John Doe' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, 'DeliveryMan'),
  )
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchDeliveryMan.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const deliveryMan = result.value.deliveryMan

    return { deliveryMan: deliveryMan.map(DeliveryManPresenter.toHTTP) }
  }
}
