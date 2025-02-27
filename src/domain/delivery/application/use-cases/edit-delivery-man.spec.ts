import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { EditDeliveryManUseCase } from './edit-delivery-man'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { UniqueEntityID } from '@/core/entity/unique-entity-id'

let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let sut: EditDeliveryManUseCase

describe('Edit Delivery Man', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    sut = new EditDeliveryManUseCase(inMemoryDeliveryManRepository)
  })

  it('should be able to edit the name of a delivery man', async () => {
    const newDeliveryMan = makeDeliveryMan(
      {},
      new UniqueEntityID('delivery-man-1'),
    )

    await inMemoryDeliveryManRepository.create(newDeliveryMan)

    await sut.execute({
      deliveryManId: newDeliveryMan.id.toValue(),
      name: 'John Doe',
    })

    expect(inMemoryDeliveryManRepository.items[0]).toMatchObject({
      name: 'John Doe',
      cpf: newDeliveryMan.cpf,
    })
  })

  it('should be able to edit the cpf of a delivery man', async () => {
    const newDeliveryMan = makeDeliveryMan()

    await inMemoryDeliveryManRepository.create(newDeliveryMan)

    await sut.execute({
      deliveryManId: newDeliveryMan.id.toValue(),
      cpf: '12345678912',
    })

    expect(inMemoryDeliveryManRepository.items[0]).toMatchObject({
      cpf: '12345678912',
      name: newDeliveryMan.name,
    })
  })

  it('should be able to edit the cpf and name of a delivery man', async () => {
    const newDeliveryMan = makeDeliveryMan()

    await inMemoryDeliveryManRepository.create(newDeliveryMan)

    await sut.execute({
      deliveryManId: newDeliveryMan.id.toValue(),
      name: 'John Doe',
      cpf: '12345678912',
    })

    expect(inMemoryDeliveryManRepository.items[0]).toMatchObject({
      name: 'John Doe',
      cpf: '12345678912',
    })
  })
})
