import { AbilityBuilder, ExtractSubjectType, PureAbility } from '@casl/ability'
import { Injectable } from '@nestjs/common'
import { UserRole } from '@prisma/client'

export enum Action {
  Manage = 'manage',
  Read = 'read',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = 'DeliveryMan' | 'all'

export type AppAbility = PureAbility<[Action, Subjects]>

@Injectable()
export class AbilityFactory {
  createForUser(user: any) {
    const { can, build } = new AbilityBuilder<AppAbility>(PureAbility)

    if (user.role === UserRole.ADMIN) {
      can(Action.Manage, 'DeliveryMan')
    }

    return build({
      detectSubjectType: (item: any) =>
        item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
