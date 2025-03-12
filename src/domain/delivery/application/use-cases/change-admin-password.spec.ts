import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { ChangeAdminPasswordUseCase } from './change-admin-password'
import { makeAdmin } from 'test/factories/make-admin'
import { UniqueEntityID } from '@/core/entity/unique-entity-id'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher

let sut: ChangeAdminPasswordUseCase

describe('Change Admin Password', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()

    sut = new ChangeAdminPasswordUseCase(inMemoryAdminsRepository, fakeHasher)
  })

  it('should be able to change password of a admin', async () => {
    const newAdmin = makeAdmin({}, new UniqueEntityID('admin-1'))

    await inMemoryAdminsRepository.create(newAdmin)

    await sut.execute({
      adminId: newAdmin.id.toValue(),
      password: '654321',
    })

    expect(inMemoryAdminsRepository.items[0]).toMatchObject({
      name: newAdmin.name,
      password: '654321-hashed',
    })
  })
})
