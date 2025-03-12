import { OrderAttachmentsRepository } from '@/domain/delivery/application/repositories/order-attachments-repository'
import { PrismaService } from '../prisma.service'
import { PrismaOrderAttachmentMapper } from '../mappers/prisma-order-attachment-mapper'
import { OrderAttachment } from '@/domain/delivery/enterprise/entities/order-attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaOrderAttachmentsRepository
  implements OrderAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(attachment: OrderAttachment) {
    const data = PrismaOrderAttachmentMapper.toPrismaUpdate(attachment)

    await this.prisma.attachment.update(data)
  }
}
