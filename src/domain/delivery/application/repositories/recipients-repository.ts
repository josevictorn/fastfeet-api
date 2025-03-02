import { PaginationParams } from '@/core/repositories/pagination-params'
import { Recipient } from '../../enterprise/entities/recipent'

export abstract class RecipientsRepository {
  abstract findByEmail(email: string): Promise<Recipient | null>
  abstract findById(recipientId: string): Promise<Recipient | null>
  abstract create(recipient: Recipient): Promise<void>
  abstract findMany(params: PaginationParams): Promise<Recipient[]>
  abstract delete(recipient: Recipient): Promise<void>
}
