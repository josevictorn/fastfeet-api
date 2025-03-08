import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { OrderStatus } from '@/core/enums/order-status'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { WithdrawOrderUseCase } from './withdraw-order'
import { makeOrder } from 'test/factories/make-order'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository

let sut: WithdrawOrderUseCase

describe('Withdraw Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()

    sut = new WithdrawOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliveryManRepository,
    )
  })

  it('should be able to change order status to withdrawn', async () => {
    const order = makeOrder()

    await inMemoryOrdersRepository.create(order)

    const deliveryMan = makeDeliveryMan()

    await inMemoryDeliveryManRepository.create(deliveryMan)

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      order: expect.objectContaining({
        deliveryManId: deliveryMan.id,
        status: OrderStatus.WITHDRAWN,
      }),
    })
  })
})
