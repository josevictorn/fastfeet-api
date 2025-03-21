import { DomainEvent } from '@/core/events/domain-event'

import { Order } from '../entities/order'
import { UniqueEntityID } from '@/core/entity/unique-entity-id'

export class OrderStatusUpdatedEvent implements DomainEvent {
  public ocurredAt: Date
  public order: Order

  constructor(order: Order) {
    this.order = order
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id
  }
}
