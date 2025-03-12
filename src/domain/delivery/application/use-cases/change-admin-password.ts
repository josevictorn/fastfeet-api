import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Admin } from '../../enterprise/entities/admin'
import { Injectable } from '@nestjs/common'
import { AdminsRepository } from '../repositories/admins-repository'
import { HashGenerator } from '../cryptography/hash-generator'

interface ChangeAdminPasswordUseCaseRequest {
  adminId: string
  password: string
}

type ChangeAdminPasswordUseCaseResponse = Either<
  NotAllowedError,
  {
    admin: Admin
  }
>

@Injectable()
export class ChangeAdminPasswordUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    adminId,
    password,
  }: ChangeAdminPasswordUseCaseRequest): Promise<ChangeAdminPasswordUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (adminId !== admin?.id.toString()) {
      return left(new NotAllowedError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    admin.password = hashedPassword

    await this.adminsRepository.create(admin)

    return right({
      admin,
    })
  }
}
