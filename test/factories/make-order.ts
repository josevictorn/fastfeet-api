import { UniqueEntityID } from '@/core/entity/unique-entity-id'
import { Order, OrderProps } from '@/domain/delivery/enterprise/entities/order'

import { OrderStatus } from '@prisma/client'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      recipientId: new UniqueEntityID(),
      status: OrderStatus.PENDING,
      ...override,
    },
    id,
  )

  return order
}
