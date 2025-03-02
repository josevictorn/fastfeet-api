import { DeleteRecipientUseCase } from '@/domain/delivery/application/use-cases/delete-recipient'
import { RecipientNotFoundError } from '@/domain/delivery/application/use-cases/erros/recipient-not-found-error'
import { Action, AppAbility } from '@/infra/permissions/ability.factory'
import { PoliciesGuard } from '@/infra/permissions/policies.guard'
import { CheckPolicies } from '@/infra/permissions/policy.decorator'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('recipients')
@ApiBearerAuth()
@Controller('/recipients/:id')
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a recipient' })
  @ApiResponse({ status: 204, description: 'Recipient deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  @ApiResponse({ status: 404, description: 'Recipient not found.' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, 'Recipient'),
  )
  async handle(@Param('id') recipientId: string) {
    const result = await this.deleteRecipient.execute({
      recipientId,
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
