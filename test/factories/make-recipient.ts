import { UniqueEntityID } from '@/core/entity/unique-entity-id'
import {
  Recipient,
  RecipientProps,
} from '@/domain/delivery/enterprise/entities/recipent'
import { faker } from '@faker-js/faker/locale/pt_BR'

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      street: faker.location.street(),
      number: faker.number.int(10000),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      ...override,
    },
    id,
  )

  return recipient
}
