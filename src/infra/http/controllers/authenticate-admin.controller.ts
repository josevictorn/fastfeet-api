import { AuthenticateAdminUseCase } from '@/domain/delivery/application/use-cases/authenticate-admin'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { WrongCredentialsError } from '@/domain/delivery/application/use-cases/erros/wrong-credentials-error'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

const authenticateAdminBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

type AuthenticateAdminBodySchema = z.infer<typeof authenticateAdminBodySchema>

@ApiTags('auth')
@Controller('/sessions/admin')
export class AuthenticateAdminController {
  constructor(private authenticateAdmin: AuthenticateAdminUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Log in with an admin user' })
  @ApiBody({
    description: 'Data for logging in with an admin user',
    schema: {
      type: 'object',
      properties: {
        cpf: { type: 'string', example: '12345678900' },
        password: { type: 'string', example: 'senhaSecreta123' },
      },
      required: ['cpf', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'Logged in successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiResponse({ status: 401, description: 'Wrong credentials error.' })
  @UsePipes(new ZodValidationPipe(authenticateAdminBodySchema))
  async handle(@Body() body: AuthenticateAdminBodySchema) {
    const { cpf, password } = body

    const result = await this.authenticateAdmin.execute({
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
