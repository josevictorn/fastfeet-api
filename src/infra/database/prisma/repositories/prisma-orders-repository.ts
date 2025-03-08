import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository'
import { PrismaService } from '../prisma.service'
import { Order } from '@/domain/delivery/enterprise/entities/order'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order) {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })
  }
}
