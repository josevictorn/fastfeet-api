import { Injectable } from '@nestjs/common'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { Recipient } from '../../enterprise/entities/recipient'
import { Either, right } from '@/core/either'

interface FetchRecipientsUseCaseRequest {
  page: number
}

type FetchRecipientsUseCaseResponse = Either<
  null,
  {
    recipients: Recipient[]
  }
>

@Injectable()
export class FetchRecipientsUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    page,
  }: FetchRecipientsUseCaseRequest): Promise<FetchRecipientsUseCaseResponse> {
    const recipients = await this.recipientsRepository.findMany({ page })

    return right({
      recipients,
    })
  }
}
