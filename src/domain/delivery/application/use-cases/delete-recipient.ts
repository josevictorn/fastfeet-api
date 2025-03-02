import { Either, left, right } from '@/core/either'
import { RecipientNotFoundError } from './erros/recipient-not-found-error'
import { Injectable } from '@nestjs/common'
import { RecipientsRepository } from '../repositories/recipients-repository'

interface DeleteRecipientRequest {
  recipientId: string
}

type DeleteRecipientResponse = Either<RecipientNotFoundError, null>

@Injectable()
export class DeleteRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
  }: DeleteRecipientRequest): Promise<DeleteRecipientResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new RecipientNotFoundError())
    }

    await this.recipientsRepository.delete(recipient)

    return right(null)
  }
}
