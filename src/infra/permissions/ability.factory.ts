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
  PickUp = 'pickUp',
  Return = 'return',
}

export type Subjects = 'DeliveryMan' | 'Recipient' | 'Order' | 'all'

export type AppAbility = MongoAbility<[Action, Subjects]>

@Injectable()
export class AbilityFactory {
  createForUser(user: any, requestParam: string) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    )

    if (user.role === UserRole.ADMIN) {
      can(Action.Manage, 'DeliveryMan')
      cannot(Action.PickUp, 'DeliveryMan')
      cannot(Action.Return, 'DeliveryMan')
      can(Action.Manage, 'Recipient')
      cannot(Action.PickUp, 'Recipient')
      cannot(Action.Return, 'Recipient')
      can(Action.Manage, 'Order')
      cannot(Action.PickUp, 'Order')
    } else if (user.role === UserRole.DELIVERY_MAN) {
      if (requestParam === user.id) {
        can(Action.Read, 'DeliveryMan')
        can(Action.Update, 'DeliveryMan')
      }

      can(Action.PickUp, 'Order')
    }

    return build({
      detectSubjectType: (item: any) =>
        item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
