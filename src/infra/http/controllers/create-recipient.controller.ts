import { CreateRecipientUseCase } from '@/domain/delivery/application/use-cases/create-recipient'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
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
import { RecipientAlreadyExistsError } from '@/domain/delivery/application/use-cases/erros/recipient-already-exists-erros'
import { PoliciesGuard } from '@/infra/permissions/policies.guard'
import { CheckPolicies } from '@/infra/permissions/policy.decorator'
import { Action, AppAbility } from '@/infra/permissions/ability.factory'

const createRecipientBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  street: z.string(),
  complement: z.string().optional(),
  number: z.number(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
})

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>

@ApiTags('recipient')
@ApiBearerAuth()
@Controller('/recipient')
@UsePipes(new ZodValidationPipe(createRecipientBodySchema))
export class CreateRecipientContoller {
  constructor(private createRecipient: CreateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new recipient' })
  @ApiBody({
    description: 'Data for recipient creation',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'João da Silva' },
        email: { type: 'string', example: 'joaosilva@email.com' },
        street: { type: 'string', example: 'Rua das Flores' },
        complement: { type: 'string', example: 'Apto 101' },
        number: { type: 'number', example: 123 },
        city: { type: 'string', example: 'São Paulo' },
        state: { type: 'string', example: 'SP' },
        zipCode: { type: 'string', example: '12345-678' },
      },
      required: [
        'name',
        'email',
        'street',
        'number',
        'city',
        'state',
        'zipCode',
      ],
    },
  })
  @ApiResponse({ status: 201, description: 'Recipient created successfully.' })
  @ApiResponse({ status: 409, description: 'Recipient already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'Recipient'),
  )
  async handle(@Body() body: CreateRecipientBodySchema) {
    const { name, email, street, complement, number, city, state, zipCode } =
      body

    const result = await this.createRecipient.execute({
      name,
      email,
      street,
      complement,
      number,
      city,
      state,
      zipCode,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case RecipientAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
