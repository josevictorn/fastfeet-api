import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Recipient } from '../../enterprise/entities/recipent'
import { DeliveryManNotFoundError } from './erros/delivery-man-not-found-error'
import { Either, left, right } from '@/core/either'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientNotFoundError } from './erros/recipient-not-found-error'

interface EditRecipientUseCaseRequest {
  recipientId: string
  name?: string
  email?: string
  street?: string
  number?: number
  complement?: string | null
  city?: string
  state?: string
  zipCode?: string
}

type EditRecipientUseCaseResponse = Either<
  DeliveryManNotFoundError | NotAllowedError,
  {
    recipient: Recipient
  }
>

export class EditRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
    name,
    email,
    street,
    number,
    complement,
    city,
    state,
    zipCode,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new RecipientNotFoundError())
    }

    if (recipientId !== recipient.id.toString()) {
      return left(new NotAllowedError())
    }

    recipient.name = name || recipient.name
    recipient.email = email || recipient.email
    recipient.street = street || recipient.street
    recipient.number = number || recipient.number
    recipient.complement = complement || recipient.complement
    recipient.city = city || recipient.city
    recipient.state = state || recipient.state
    recipient.zipCode = zipCode || recipient.zipCode

    await this.recipientsRepository.save(recipient)

    return right({
      recipient,
    })
  }
}
