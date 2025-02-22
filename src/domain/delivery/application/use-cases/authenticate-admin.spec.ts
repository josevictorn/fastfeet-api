import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateAdminUseCase } from './authenticate-admin'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { WrongCredentialsError } from './erros/wrong-credentials-error'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateAdminUseCase

describe('Authenticate Admin', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateAdminUseCase(
      inMemoryAdminsRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate an admin', async () => {
    const admin = makeAdmin({
      cpf: '789.716.810-71',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      cpf: '789.716.810-71',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate an admin with wrong cpf', async () => {
    const admin = makeAdmin({
      cpf: '789.716.810-71',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      cpf: '789.716.810-72',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate an admin with wrong password', async () => {
    const admin = makeAdmin({
      cpf: '789.716.810-71',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      cpf: '789.716.810-71',
      password: '123457',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
