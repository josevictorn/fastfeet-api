import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { EditRecipientUseCase } from './edit-recipient'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: EditRecipientUseCase

describe('Edit Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new EditRecipientUseCase(inMemoryRecipientsRepository)
  })

  it.only('should be able to edit an recipient', async () => {
    const newRecipient = makeRecipient()

    await inMemoryRecipientsRepository.create(newRecipient)

    await sut.execute({
      recipientId: newRecipient.id.toValue(),
      name: 'John Doe',
      email: 'johndoe@email.com',
      state: 'RN',
      city: 'Natal',
    })

    expect(inMemoryRecipientsRepository.items[0]).toMatchObject({
      id: newRecipient.id,
      name: 'John Doe',
      email: 'johndoe@email.com',
      street: newRecipient.street,
      complement: newRecipient.complement,
      number: newRecipient.number,
      city: 'Natal',
      state: 'RN',
      zipCode: newRecipient.zipCode,
    })
  })
})
