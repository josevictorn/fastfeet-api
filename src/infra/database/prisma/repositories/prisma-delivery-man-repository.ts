import { DeliveryManRepository } from '@/domain/delivery/application/repositories/delivery-man-repository'
import { PrismaService } from '../prisma.service'
import { DeliveryMan } from '@/domain/delivery/enterprise/entities/delivery-man'
import { PrismaDeliveryManMapper } from '../mappers/prisma-delivery-man-mapper'
import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { UserRole } from '@prisma/client'

@Injectable()
export class PrismaDeliveryManRepository implements DeliveryManRepository {
  constructor(private prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<DeliveryMan | null> {
    const deliveryMan = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!deliveryMan) {
      return null
    }

    return PrismaDeliveryManMapper.toDomain(deliveryMan)
  }

  async create(deliveryMan: DeliveryMan): Promise<void> {
    const data = PrismaDeliveryManMapper.toPrisma(deliveryMan)

    await this.prisma.user.create({
      data,
    })
  }

  async save(deliveryMan: DeliveryMan): Promise<void> {
    const data = PrismaDeliveryManMapper.toPrisma(deliveryMan)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async findById(id: string) {
    const deliveryMan = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!deliveryMan) {
      return null
    }

    return PrismaDeliveryManMapper.toDomain(deliveryMan)
  }

  async findMany({ page }: PaginationParams) {
    const deliveryMan = await this.prisma.user.findMany({
      where: {
        role: UserRole.DELIVERY_MAN,
      },
      take: 20,
      skip: (page - 1) & 20,
    })

    return deliveryMan.map(PrismaDeliveryManMapper.toDomain)
  }
}
