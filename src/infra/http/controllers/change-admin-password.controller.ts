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
  ForbiddenException,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { ChangeAdminPasswordUseCase } from '@/domain/delivery/application/use-cases/change-admin-password'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

const changeAdminPasswordBodySchema = z.object({
  password: z.string(),
})

type ChangeAdminPasswordBodySchema = z.infer<
  typeof changeAdminPasswordBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(changeAdminPasswordBodySchema)

@ApiTags('auth')
@ApiBearerAuth()
@Controller('/accounts/admin/:id/change-password')
export class ChangeAdminPasswordController {
  constructor(private changeAdminPassword: ChangeAdminPasswordUseCase) {}

  @Patch()
  @HttpCode(204)
  @ApiOperation({ summary: 'Change admin password' })
  @ApiBody({
    description: 'Data for changing administrator password',
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string', example: 'senhaSecreta123' },
      },
    },
  })
  @ApiResponse({
    status: 204,
    description: 'Admin password changed successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  async handle(
    @Body(bodyValidationPipe) body: ChangeAdminPasswordBodySchema,
    @Param('id') adminId: string,
  ) {
    const { password } = body

    const result = await this.changeAdminPassword.execute({
      password,
      adminId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
