import { UniqueEntityID } from '@/core/entity/unique-entity-id'
import { Order } from '@/domain/delivery/enterprise/entities/order'
import { OrderCode } from '@/domain/delivery/enterprise/entities/order-code'
import { Prisma, Order as PrismaOrder } from '@prisma/client'

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        code: new OrderCode(raw.code),
        deliveryManId: raw.deliveryManId
          ? new UniqueEntityID(raw.deliveryManId)
          : null,
        recipientId: new UniqueEntityID(raw.recipientId),
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      code: order.code.toString(),
      deliveryManId: order.deliveryManId?.toString(),
      recipientId: order.recipientId?.toString(),
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
