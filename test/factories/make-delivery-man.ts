import { UniqueEntityID } from '@/core/entity/unique-entity-id'
import {
  DeliveryMan,
  DeliveryManProps,
} from '@/domain/delivery/enterprise/entities/delivery-man'
import { PrismaDeliveryManMapper } from '@/infra/database/prisma/mappers/prisma-delivery-man-mapper'
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

export function makeDeliveryMan(
  override: Partial<DeliveryManProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryMan = DeliveryMan.create(
    {
      name: faker.person.fullName(),
      cpf: generateCPF(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return deliveryMan
}

@Injectable()
export class DeliveryManFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryMan(
    data: Partial<DeliveryManProps> = {},
  ): Promise<DeliveryMan> {
    const deliveryMan = makeDeliveryMan(data)

    await this.prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(deliveryMan),
    })

    return deliveryMan
  }
}
