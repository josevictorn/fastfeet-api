import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { RegisterDeliveryManUseCase } from './register-delivery-man'
import { DeliveryManAlreadyExistsError } from './erros/delivery-man-already-exists-error'

let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let fakeHasher: FakeHasher

let sut: RegisterDeliveryManUseCase

describe('Register Delivery Man', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterDeliveryManUseCase(
      inMemoryDeliveryManRepository,
      fakeHasher,
    )
  })

  it('should be able to register a new delivery man', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678911',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryMan: inMemoryDeliveryManRepository.items[0],
    })
  })

  it('should hash delivery man password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678911',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryManRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })

  it('should not be able to register delivery man with same cpf', async () => {
    await sut.execute({
      name: 'John Doe',
      cpf: '12345678911',
      password: '123456',
    })

    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678911',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DeliveryManAlreadyExistsError)
  })
})
