import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { WrongCredentialsError } from './erros/wrong-credentials-error'
import { AuthenticateDeliveryManUseCase } from './authenticate-delivery-man'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'

let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateDeliveryManUseCase

describe('Authenticate Delivery Man', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateDeliveryManUseCase(
      inMemoryDeliveryManRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate an delivery man', async () => {
    const deliveryMan = makeDeliveryMan({
      cpf: '789.716.810-71',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDeliveryManRepository.items.push(deliveryMan)

    const result = await sut.execute({
      cpf: '789.716.810-71',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate an delevery man with wrong cpf', async () => {
    const deliveryMan = makeDeliveryMan({
      cpf: '789.716.810-71',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDeliveryManRepository.items.push(deliveryMan)

    const result = await sut.execute({
      cpf: '789.716.810-72',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate an delivery man with wrong password', async () => {
    const deliveryMan = makeDeliveryMan({
      cpf: '789.716.810-71',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDeliveryManRepository.items.push(deliveryMan)

    const result = await sut.execute({
      cpf: '789.716.810-71',
      password: '123457',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
