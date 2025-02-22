import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { RegisterAdminUseCase } from './register-admin'
import { AdminAlreadyExistsError } from './erros/admin-already-exists-error'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher

let sut: RegisterAdminUseCase

describe('Register Admin', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterAdminUseCase(inMemoryAdminsRepository, fakeHasher)
  })

  it('should be able to register a new admin', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678911',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      admin: inMemoryAdminsRepository.items[0],
    })
  })

  it('should hash admin password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678911',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryAdminsRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to register admin with same cpf', async () => {
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
    expect(result.value).toBeInstanceOf(AdminAlreadyExistsError)
  })
})
