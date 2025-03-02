import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { EditRecipientUseCase } from '@/domain/delivery/application/use-cases/edit-recipient'
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { PoliciesGuard } from '@/infra/permissions/policies.guard'
import { CheckPolicies } from '@/infra/permissions/policy.decorator'
import { Action, AppAbility } from '@/infra/permissions/ability.factory'
import { RecipientNotFoundError } from '@/domain/delivery/application/use-cases/erros/recipient-not-found-error'

const editRecipientBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  street: z.string().optional(),
  complement: z.string().optional(),
  number: z.number().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
})

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema)

@ApiTags('recipients')
@ApiBearerAuth()
@Controller('/recipients/:id')
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Patch()
  @HttpCode(204)
  @ApiOperation({ summary: 'Edit a recipient data' })
  @ApiBody({
    description: 'Data for editing the recipient',
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
    },
  })
  @ApiResponse({ status: 204, description: 'Recipient edited successfully.' })
  @ApiResponse({ status: 404, description: 'Recipient not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, 'Recipient'),
  )
  async handle(
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
    @Param('id') recipientId: string,
  ) {
    const { name, email, street, complement, number, city, state, zipCode } =
      body

    const result = await this.editRecipient.execute({
      recipientId,
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
        case RecipientNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
