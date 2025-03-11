import { OrderAttachmentsRepository } from '@/domain/delivery/application/repositories/order-attachments-repository'
import { OrderAttachment } from '@/domain/delivery/enterprise/entities/order-attachment'

export class InMemoryOrderAttachmentsRepository
  implements OrderAttachmentsRepository
{
  public items: OrderAttachment[] = []

  async create(attachment: OrderAttachment) {
    this.items.push(attachment)
  }
}
