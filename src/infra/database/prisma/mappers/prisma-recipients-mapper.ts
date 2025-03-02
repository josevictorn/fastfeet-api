import { UniqueEntityID } from '@/core/entity/unique-entity-id'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipent'
import { Prisma, Recipient as PrismaRecipient } from '@prisma/client'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        email: raw.email,
        street: raw.street,
        number: raw.number,
        complement: raw.complement,
        city: raw.city,
        state: raw.state,
        zipCode: raw.zipCode,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      street: recipient.street,
      number: recipient.number,
      complement: recipient.complement,
      city: recipient.city,
      state: recipient.state,
      zipCode: recipient.zipCode,
    }
  }
}
