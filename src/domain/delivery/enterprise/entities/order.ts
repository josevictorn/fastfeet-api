import { UniqueEntityID } from '@/core/entity/unique-entity-id'
import { OrderCode } from './order-code'
import { OrderStatus } from '@/core/enums/order-status'
import { Optional } from '@/core/types/optional'
import { AggregateRoot } from '@/core/entity/aggregate-root'
import { OrderAttachment } from './order-attachment'
import { OrderStatusUpdatedEvent } from '../events/order-status-updated-event'

export interface OrderProps {
  code: OrderCode
  deliveryManId: UniqueEntityID | null
  recipientId: UniqueEntityID
  status: keyof typeof OrderStatus
  attachment: OrderAttachment | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Order extends AggregateRoot<OrderProps> {
  get code() {
    return this.props.code
  }

  get deliveryManId() {
    return this.props.deliveryManId
  }

  get recipientId() {
    return this.props.recipientId
  }

  get status() {
    return this.props.status
  }

  get attachment() {
    return this.props.attachment
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set deliveryManId(deliveryManId: UniqueEntityID | null) {
    this.props.deliveryManId = deliveryManId
  }

  set recipientId(recipientId: UniqueEntityID) {
    this.props.recipientId = recipientId
  }

  set status(status: keyof typeof OrderStatus) {
    if (status !== this.props.status) {
      this.addDomainEvent(new OrderStatusUpdatedEvent(this))
    }
    this.props.status = status
    this.touch()
  }

  set attachment(attachment: OrderAttachment | null) {
    this.props.attachment = attachment
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<
      OrderProps,
      'createdAt' | 'attachment' | 'deliveryManId' | 'code'
    >,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        code: props.code ?? new OrderCode(),
        attachment: props.attachment ?? null,
        deliveryManId: props.deliveryManId ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: new Date(),
      },
      id,
    )

    return order
  }
}
