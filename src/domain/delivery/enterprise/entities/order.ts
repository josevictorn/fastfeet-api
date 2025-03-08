import { UniqueEntityID } from '@/core/entity/unique-entity-id'
import { OrderCode } from './order-code'
import { OrderStatus } from '@/core/enums/order-status'
import { Entity } from '@/core/entity/entity'
import { Optional } from '@/core/types/optional'

export interface OrderProps {
  code: OrderCode
  deliveryManId: UniqueEntityID | null
  recipientId: UniqueEntityID
  status: keyof typeof OrderStatus
  attachment: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Order extends Entity<OrderProps> {
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
    this.props.status = status
    this.touch()
  }

  set attachment(attachment: string | null) {
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
      },
      id,
    )

    return order
  }
}
