import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { GetDeliveryManByIdUseCase } from './get-delivery-man-by-id'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'

let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let sut: GetDeliveryManByIdUseCase

describe('Get Delivery Man', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    sut = new GetDeliveryManByIdUseCase(inMemoryDeliveryManRepository)
  })

  it('should be able to get a delivery man', async () => {
    const deliveryMan = makeDeliveryMan({ name: 'John Doe' })

    await inMemoryDeliveryManRepository.create(deliveryMan)

    const result = await sut.execute({
      id: deliveryMan.id.toString(),
    })

    expect(result.value).toMatchObject({
      deliveryMan: expect.objectContaining({
        id: deliveryMan.id,
        cpf: deliveryMan.cpf,
        name: deliveryMan.name,
        password: deliveryMan.password,
      }),
    })
  })
})
