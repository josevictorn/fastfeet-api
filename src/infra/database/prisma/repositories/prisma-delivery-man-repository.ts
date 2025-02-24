import { DeliveryManRepository } from '@/domain/delivery/application/repositories/delivery-man-repository'
import { PrismaService } from '../prisma.service'
import { DeliveryMan } from '@/domain/delivery/enterprise/entities/delivery-man'
import { PrismaDeliveryManMapper } from '../mappers/prisma-delivery-man-mapper'
import { Injectable } from '@nestjs/common'

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
}
