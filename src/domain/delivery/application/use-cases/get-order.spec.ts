import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { GetOrderUseCase } from './get-order'
import { makeOrder } from 'test/factories/make-order'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: GetOrderUseCase

describe('Get Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new GetOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to get an order', async () => {
    const order = makeOrder()

    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      id: order.id.toString(),
    })

    expect(result.value).toMatchObject({
      order: expect.objectContaining({
        id: order.id,
        code: order.code,
        deliveryManId: order.deliveryManId,
        recipientId: order.recipientId,
        status: order.status,
      }),
    })
  })
})
