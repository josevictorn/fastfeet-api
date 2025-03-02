import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { CreateRecipientUseCase } from './create-recipient'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { RecipientAlreadyExistsError } from './erros/recipient-already-exists-erros'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository

let sut: CreateRecipientUseCase

describe('Create Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()

    sut = new CreateRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to create a new recipient', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      street: faker.location.street(),
      number: faker.number.int(10000),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: inMemoryRecipientsRepository.items[0],
    })
  })

  it('should not be able to register recipient with same email', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      street: faker.location.street(),
      number: faker.number.int(10000),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
    })

    const result = await await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      street: faker.location.street(),
      number: faker.number.int(10000),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(RecipientAlreadyExistsError)
  })
})
