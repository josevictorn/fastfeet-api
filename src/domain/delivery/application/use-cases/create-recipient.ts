import { Either, left, right } from '@/core/either'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientAlreadyExistsError } from './erros/recipient-already-exists-erros'
import { Recipient } from '../../enterprise/entities/recipent'
import { Injectable } from '@nestjs/common'

interface CreateRecipientUseCaseRequest {
  name: string
  email: string
  street: string
  number: number
  complement?: string | null
  city: string
  state: string
  zipCode: string
}

type CreateRecipientUseCaseResponse = Either<
  RecipientAlreadyExistsError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(private repicientRepository: RecipientsRepository) {}

  async execute({
    name,
    email,
    street,
    number,
    complement,
    city,
    state,
    zipCode,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const recipientWithSameEmail =
      await this.repicientRepository.findByEmail(email)

    if (recipientWithSameEmail) {
      return left(new RecipientAlreadyExistsError(email))
    }

    const recipient = Recipient.create({
      name,
      email,
      street,
      number,
      complement,
      city,
      state,
      zipCode,
    })

    await this.repicientRepository.create(recipient)

    return right({ recipient })
  }
}
