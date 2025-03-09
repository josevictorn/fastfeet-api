import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { FetchOrdersFromDeliveryManUseCase } from './fetch-orders-from-delivery-man'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchOrdersFromDeliveryManUseCase

describe('Fetch Orders From Delivery Man', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new FetchOrdersFromDeliveryManUseCase(inMemoryOrdersRepository)
  })

  it('should be able to fetch orders from delivery man', async () => {
    const deliveryMan = makeDeliveryMan()

    const order1 = makeOrder({
      deliveryManId: deliveryMan.id,
    })

    const order2 = makeOrder({
      deliveryManId: deliveryMan.id,
    })

    const order3 = makeOrder({
      deliveryManId: deliveryMan.id,
    })

    await inMemoryOrdersRepository.create(order1)
    await inMemoryOrdersRepository.create(order2)
    await inMemoryOrdersRepository.create(order3)

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
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
