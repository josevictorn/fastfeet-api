import { Either, left, right } from '@/core/either'
import { RecipientNotFoundError } from './erros/recipient-not-found-error'
import { Recipient } from '../../enterprise/entities/recipent'
import { Injectable } from '@nestjs/common'
import { RecipientsRepository } from '../repositories/recipients-repository'

interface GetRecipientByIdUseCaseRequest {
  id: string
}

type GetRecipientByIdUseCaseResponse = Either<
  RecipientNotFoundError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class GetRecipientByIdUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    id,
  }: GetRecipientByIdUseCaseRequest): Promise<GetRecipientByIdUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(id)

    if (!recipient) {
      return left(new RecipientNotFoundError())
    }

    return right({
      recipient,
    })
  }
}
