import { DeliveryMan } from '@/domain/delivery/enterprise/entities/delivery-man'
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  MongoAbility,
  PureAbility,
} from '@casl/ability'
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

export type AppAbility = MongoAbility<[Action, Subjects]>

@Injectable()
export class AbilityFactory {
  createForUser(user: any, requestParam: string) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

    if (user.role === UserRole.ADMIN) {
      can(Action.Manage, 'DeliveryMan')
    } else if (
      user.role === UserRole.DELIVERY_MAN &&
      requestParam === user.id
    ) {
      can(Action.Read, 'DeliveryMan')
      can(Action.Update, 'DeliveryMan')
    }

    return build({
      detectSubjectType: (item: any) =>
        item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
