import { OrderNotFoundError } from './erros/order-not-found-error'
import { OrderStatus } from '@prisma/client'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders-repository'
import { Order } from '../../enterprise/entities/order'

interface ReturnOrderUseCaseRequest {
  orderId: string
}

type ReturnOrderUseCaseResponse = Either<
  OrderNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class ReturnOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
  }: ReturnOrderUseCaseRequest): Promise<ReturnOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new OrderNotFoundError())
    }

    order.status = OrderStatus.RETURNED

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
