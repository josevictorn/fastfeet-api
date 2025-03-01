import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AbilityFactory, AppAbility } from './ability.factory'
import { CHECK_POLICIES_KEY } from './policy.decorator'
import { UserPayload } from '../auth/jwt.strategy'
import { PrismaService } from '../database/prisma/prisma.service'
import { PolicyHandler } from './policyHandler'

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || []

    const request = context.switchToHttp().getRequest()

    const requestUser: UserPayload = request.user

    const user = await this.prisma.user.findFirst({
      where: {
        id: requestUser.sub,
      },
    })

    const requestParam = request.params.id

    const ability = this.abilityFactory.createForUser(user, requestParam)

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    )
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability)
    }
    return handler.handle(ability)
  }
}
