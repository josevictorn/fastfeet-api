import { Entity } from '@/core/entity/entity'
import { UniqueEntityID } from '@/core/entity/unique-entity-id'

export interface OrderAttachmentProps {
  orderId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class OrderAttachment extends Entity<OrderAttachmentProps> {
  get orderId() {
    return this.props.orderId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: OrderAttachmentProps, id?: UniqueEntityID) {
    const attachment = new OrderAttachment(props, id)

    return attachment
  }
}
