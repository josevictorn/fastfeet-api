import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { OrderStatus } from '@/core/enums/order-status'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { makeOrder } from 'test/factories/make-order'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { PickUpOrderUseCase } from './pick-up-order'
import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments-repository'

let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository

let sut: PickUpOrderUseCase

describe('PickUp Order', () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
    )
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()

    sut = new PickUpOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliveryManRepository,
    )
  })

  it('should be able to pick up order', async () => {
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
