import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FetchRecipientsUseCase } from '@/domain/delivery/application/use-cases/fetch-recipients'
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CheckPolicies } from '@/infra/permissions/policy.decorator'
import { Action, AppAbility } from '@/infra/permissions/ability.factory'
import { RecipientPresenter } from '../presenters/recipient-presenter'
import { PoliciesGuard } from '@/infra/permissions/policies.guard'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('recipients')
@ApiBearerAuth()
@Controller('/recipients')
export class FetchRecipientsController {
  constructor(private fetchRecipients: FetchRecipientsUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Fetch recipients data' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'array',
      items: {
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
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Recipient'))
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecipients.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const recipients = result.value.recipients

    return { recipients: recipients.map(RecipientPresenter.toHTTP) }
  }
}
