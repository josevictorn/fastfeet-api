import { PaginationParams } from '@/core/repositories/pagination-params'
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipent'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  async findByEmail(email: string) {
    const recipient = this.items.find((item) => item.email === email)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findById(recipientId: string) {
    const recipient = this.items.find(
      (item) => item.id.toString() === recipientId,
    )

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findMany({ page }: PaginationParams) {
    const recipients = this.items.slice((page - 1) * 20, page * 20)

    return recipients
  }

  async create(recipient: Recipient) {
    this.items.push(recipient)
  }
}
