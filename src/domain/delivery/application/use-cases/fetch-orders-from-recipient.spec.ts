import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { FetchOrdersFromRecipientUseCase } from './fetch-orders-from-recipient'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchOrdersFromRecipientUseCase

describe('Fetch Orders From Recipient', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new FetchOrdersFromRecipientUseCase(inMemoryOrdersRepository)
  })

  it('should be able to fetch orders from a recipient', async () => {
    const recipient = makeRecipient()

    const order1 = makeOrder({
      recipientId: recipient.id,
    })

    const order2 = makeOrder({
      recipientId: recipient.id,
    })

    const order3 = makeOrder({
      recipientId: recipient.id,
    })

    await inMemoryOrdersRepository.create(order1)
    await inMemoryOrdersRepository.create(order2)
    await inMemoryOrdersRepository.create(order3)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      page: 1,
    })

    expect(result.value?.orders).toHaveLength(3)
    expect(result.value?.orders).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: order1.id,
          code: order1.code,
          deliveryManId: order1.deliveryManId,
          recipientId: order1.recipientId,
          status: order1.status,
        }),
        expect.objectContaining({
          id: order2.id,
          code: order2.code,
          deliveryManId: order2.deliveryManId,
          recipientId: order2.recipientId,
          status: order2.status,
        }),
        expect.objectContaining({
          id: order3.id,
          code: order3.code,
          deliveryManId: order3.deliveryManId,
          recipientId: order3.recipientId,
          status: order3.status,
        }),
      ]),
    )
  })
})
