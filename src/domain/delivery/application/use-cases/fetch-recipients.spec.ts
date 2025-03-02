import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { FetchRecipientsUseCase } from './fetch-recipients'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: FetchRecipientsUseCase

describe('Fetch Recipients', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new FetchRecipientsUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to fetch recipients', async () => {
    const recipient1 = makeRecipient()

    const recipient2 = makeRecipient()

    const recipient3 = makeRecipient()

    await inMemoryRecipientsRepository.create(recipient1)
    await inMemoryRecipientsRepository.create(recipient2)
    await inMemoryRecipientsRepository.create(recipient3)

    const result = await sut.execute({ page: 1 })

    expect(result.value?.recipients).toHaveLength(3)
    expect(result.value?.recipients).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: recipient1.id,
          email: recipient1.email,
          name: recipient1.name,
          street: recipient1.street,
          complement: recipient1.complement,
          number: recipient1.number,
          city: recipient1.city,
          state: recipient1.state,
          zipCode: recipient1.zipCode,
        }),
        expect.objectContaining({
          id: recipient2.id,
          email: recipient2.email,
          name: recipient2.name,
          street: recipient2.street,
          complement: recipient2.complement,
          number: recipient2.number,
          city: recipient2.city,
          state: recipient2.state,
          zipCode: recipient2.zipCode,
        }),
        expect.objectContaining({
          id: recipient3.id,
          email: recipient3.email,
          name: recipient3.name,
          street: recipient3.street,
          complement: recipient3.complement,
          number: recipient3.number,
          city: recipient3.city,
          state: recipient3.state,
          zipCode: recipient3.zipCode,
        }),
      ]),
    )
  })
})
