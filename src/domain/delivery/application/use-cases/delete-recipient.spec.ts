import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { DeleteRecipientUseCase } from './delete-recipient'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: DeleteRecipientUseCase

describe('Delete Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new DeleteRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to delete a recipient', async () => {
    const newRecipient = makeRecipient()

    await inMemoryRecipientsRepository.create(newRecipient)

    await sut.execute({
      recipientId: newRecipient.id.toValue(),
    })

    expect(inMemoryRecipientsRepository.items).toHaveLength(0)
  })
})
