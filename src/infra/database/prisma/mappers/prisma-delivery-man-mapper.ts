import { UniqueEntityID } from '@/core/entity/unique-entity-id'
import { DeliveryMan } from '@/domain/delivery/enterprise/entities/delivery-man'
import { Prisma, User as PrismaDeliveryMan, UserRole } from '@prisma/client'

export class PrismaDeliveryManMapper {
  static toDomain(raw: PrismaDeliveryMan): DeliveryMan {
    return DeliveryMan.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(deliveryMan: DeliveryMan): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryMan.id.toString(),
      role: UserRole.DELIVERY_MAN,
      name: deliveryMan.name,
      cpf: deliveryMan.cpf,
      password: deliveryMan.password,
    }
  }
}
