import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { FetchDeliveryManUseCase } from './fetch-delivery-man'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'

let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let sut: FetchDeliveryManUseCase

describe('Fetch Delivery Man', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    sut = new FetchDeliveryManUseCase(inMemoryDeliveryManRepository)
  })

  it('should be able to fetch delivery man', async () => {
    const deliveryMan1 = makeDeliveryMan()

    const deliveryMan2 = makeDeliveryMan()

    const deliveryMan3 = makeDeliveryMan()

    await inMemoryDeliveryManRepository.create(deliveryMan1)
    await inMemoryDeliveryManRepository.create(deliveryMan2)
    await inMemoryDeliveryManRepository.create(deliveryMan3)

    const result = await sut.execute({ page: 1 })

    expect(result.value?.deliveryMan).toHaveLength(3)
    expect(result.value?.deliveryMan).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: deliveryMan1.id,
          cpf: deliveryMan1.cpf,
          name: deliveryMan1.name,
          password: deliveryMan1.password,
        }),
        expect.objectContaining({
          id: deliveryMan2.id,
          cpf: deliveryMan2.cpf,
          name: deliveryMan2.name,
          password: deliveryMan2.password,
        }),
        expect.objectContaining({
          id: deliveryMan3.id,
          cpf: deliveryMan3.cpf,
          name: deliveryMan3.name,
          password: deliveryMan3.password,
        }),
      ]),
    )
  })
})
