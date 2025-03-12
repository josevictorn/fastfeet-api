import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'
import { OrderAttachment } from '@/domain/delivery/enterprise/entities/order-attachment'
import { UniqueEntityID } from '@/core/entity/unique-entity-id'

export class PrismaOrderAttachmentMapper {
  static toDomain(raw: PrismaAttachment): OrderAttachment {
    if (!raw.orderId) {
      throw new Error('Invalid attachment type.')
    }

    return OrderAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        orderId: new UniqueEntityID(raw.orderId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdate(
    attachment: OrderAttachment,
  ): Prisma.AttachmentUpdateArgs {
    return {
      where: {
        id: attachment.attachmentId.toString(),
      },
      data: {
        orderId: attachment.orderId.toString(),
      },
    }
  }
}
