import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { ChangeDeliveryManPasswordUseCase } from './change-delivery-man-password'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'

let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let fakeHasher: FakeHasher

let sut: ChangeDeliveryManPasswordUseCase

describe('Change Delivery Man Password', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    fakeHasher = new FakeHasher()

    sut = new ChangeDeliveryManPasswordUseCase(
      inMemoryDeliveryManRepository,
      fakeHasher,
    )
  })

  it('should be able to change password of a delivery man', async () => {
    const newDeliveryMan = makeDeliveryMan()

    await inMemoryDeliveryManRepository.create(newDeliveryMan)

    await sut.execute({
      deliveryManId: newDeliveryMan.id.toValue(),
      password: '654321',
    })

    expect(inMemoryDeliveryManRepository.items[0]).toMatchObject({
      name: newDeliveryMan.name,
      password: '654321-hashed',
    })
  })
})
