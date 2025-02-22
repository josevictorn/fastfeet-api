import { UniqueEntityID } from '@/core/entity/unique-entity-id'
import { Admin, AdminProps } from '@/domain/delivery/enterprise/entities/admin'
import { PrismaAdminMapper } from '@/infra/database/prisma/mappers/prisma-admin-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { Injectable } from '@nestjs/common'

function generateCPF(): string {
  const randomNumbers = faker.string.numeric(9)
  const cpfBase = randomNumbers.split('').map(Number)

  function calculateDigit(cpfArray: number[]): number {
    const sum = cpfArray.reduce(
      (total, num, index) => total + num * (cpfArray.length + 1 - index),
      0,
    )
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }

  const firstDigit = calculateDigit(cpfBase)
  cpfBase.push(firstDigit)
  const secondDigit = calculateDigit(cpfBase)
  cpfBase.push(secondDigit)

  return cpfBase.join('')
}

export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      cpf: generateCPF(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return admin
}

@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdmin(data)

    await this.prisma.user.create({
      data: PrismaAdminMapper.toPrisma(admin),
    })

    return admin
  }
}
