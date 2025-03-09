import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository'
import { PrismaService } from '../prisma.service'
import { Order } from '@/domain/delivery/enterprise/entities/order'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderMapper.toDomain(order)
  }

  async findMany({ page }: PaginationParams) {
    const orders = await this.prisma.order.findMany({
      take: 20,
      skip: (page - 1) & 20,
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyByDeliveryManId(
    deliveryManId: string,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    const answerComments = await this.prisma.order.findMany({
      where: {
        deliveryManId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answerComments.map(PrismaOrderMapper.toDomain)
  }

  async create(order: Order) {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })
  }

  async save(order: Order) {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
