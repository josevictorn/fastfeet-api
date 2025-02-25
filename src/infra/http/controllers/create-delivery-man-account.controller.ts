import { RegisterDeliveryManUseCase } from '@/domain/delivery/application/use-cases/register-delivery-man'
import { Action, AppAbility } from '@/infra/permissions/ability.factory'
import { PoliciesGuard } from '@/infra/permissions/policies.guard'
import { CheckPolicies } from '@/infra/permissions/policy.decorator'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeliveryManAlreadyExistsError } from '@/domain/delivery/application/use-cases/erros/delivery-man-already-exists-error'

const createDeliveryManAcountBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
})

type CreateDeliveryManAcountBodySchema = z.infer<
  typeof createDeliveryManAcountBodySchema
>

@ApiTags('auth')
@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@Controller('/accounts/delivery-man')
export class CreateDeliveryManController {
  constructor(private registerDeliveryMan: RegisterDeliveryManUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new delivery man account' })
  @ApiBody({
    description: 'Data for delivery man account creation',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'João da Silva' },
        cpf: { type: 'string', example: '12345678900' },
        password: { type: 'string', example: 'senhaSecreta123' },
      },
      required: ['name', 'cpf', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'Account created successfully.' })
  @ApiResponse({ status: 409, description: 'Account already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'DeliveryMan'),
  )
  @UsePipes(new ZodValidationPipe(createDeliveryManAcountBodySchema))
  async handle(@Body() body: CreateDeliveryManAcountBodySchema) {
    const { cpf, name, password } = body

    const result = await this.registerDeliveryMan.execute({
      name,
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DeliveryManAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
