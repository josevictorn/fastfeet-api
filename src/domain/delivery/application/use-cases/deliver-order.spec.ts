import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { OrderStatus } from '@/core/enums/order-status'
import { makeOrder } from 'test/factories/make-order'
import { DeliverOrderUseCase } from './deliver-order'
import { UniqueEntityID } from '@/core/entity/unique-entity-id'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'

let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: DeliverOrderUseCase

describe('Deliver Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()

    sut = new DeliverOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to deliver order', async () => {
    const deliveryMan = makeDeliveryMan()

    const order = makeOrder({
      deliveryManId: deliveryMan.id,
    })

    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      attachmentId: '1',
      deliveryManId: deliveryMan.id.toString(),
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      order: expect.objectContaining({
        status: OrderStatus.DELIVERED,
      }),
    })
    expect(inMemoryOrdersRepository.items[0].attachment).toEqual(
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
    )
  })
})
