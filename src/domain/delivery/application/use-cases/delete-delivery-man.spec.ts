import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { DeleteDeliveryManUseCase } from './delete-delivery-man'

let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let sut: DeleteDeliveryManUseCase

describe('Delete Delivery Man', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    sut = new DeleteDeliveryManUseCase(inMemoryDeliveryManRepository)
  })

  it('should be able to delete a delivery man', async () => {
    const newDeliveryMan = makeDeliveryMan()

    await inMemoryDeliveryManRepository.create(newDeliveryMan)

    await sut.execute({
      deliveryManId: newDeliveryMan.id.toValue(),
    })

    expect(inMemoryDeliveryManRepository.items).toHaveLength(0)
  })
})
