import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { FetchOrdersUseCase } from './fetch-orders'
import { makeOrder } from 'test/factories/make-order'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchOrdersUseCase

describe('Fetch Orders', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new FetchOrdersUseCase(inMemoryOrdersRepository)
  })

  it('should be able to fetch orders', async () => {
    const order1 = makeOrder()

    const order2 = makeOrder()

    const order3 = makeOrder()

    await inMemoryOrdersRepository.create(order1)
    await inMemoryOrdersRepository.create(order2)
    await inMemoryOrdersRepository.create(order3)

    const result = await sut.execute({ page: 1 })

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
