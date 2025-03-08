import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { OrderNotFoundError } from './erros/order-not-found-error'
import { OrderStatus } from '@prisma/client'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders-repository'
import { Order } from '../../enterprise/entities/order'

interface ReturnOrderUseCaseRequest {
  recipientId: string
  orderId: string
}

type ReturnOrderUseCaseResponse = Either<
  OrderNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

@Injectable()
export class ReturnOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    recipientId,
    orderId,
  }: ReturnOrderUseCaseRequest): Promise<ReturnOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new OrderNotFoundError())
    }

    if (recipientId !== order.recipientId.toString()) {
      return left(new NotAllowedError())
    }

    order.status = OrderStatus.RETURNED

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
