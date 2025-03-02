import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { GetRecipientByIdUseCase } from './get-recipient-by-id'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: GetRecipientByIdUseCase

describe('Get Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new GetRecipientByIdUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to get a recipient by id', async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      id: recipient.id.toString(),
    })

    expect(result.value).toMatchObject({
      recipient: expect.objectContaining({
        id: recipient.id,
        email: recipient.email,
        name: recipient.name,
        street: recipient.street,
        complement: recipient.complement,
        number: recipient.number,
        city: recipient.city,
        state: recipient.state,
        zipCode: recipient.zipCode,
      }),
    })
  })
})
