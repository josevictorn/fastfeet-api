import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { OrderStatus } from '@/core/enums/order-status'
import { makeOrder } from 'test/factories/make-order'
import { ReturnOrderUseCase } from './return-order'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: ReturnOrderUseCase

describe('Return Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()

    sut = new ReturnOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to return order', async () => {
    const recipient = makeRecipient()
    const order = makeOrder({
      recipientId: recipient.id,
    })

    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      recipientId: recipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      order: expect.objectContaining({
        status: OrderStatus.RETURNED,
      }),
    })
  })
})
