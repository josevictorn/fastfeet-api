import { Either, left, right } from '@/core/either'
import { DeliveryManNotFoundError } from './erros/delivery-man-not-found-error'
import { OrderStatus } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { DeliveryManRepository } from '../repositories/delivery-man-repository'
import { OrdersRepository } from '../repositories/orders-repository'
import { Order } from '../../enterprise/entities/order'
import { OrderNotFoundError } from './erros/order-not-found-error'

interface WithdrawOrderUseCaseRequest {
  deliveryManId: string
  orderId: string
}

type WithdrawOrderUseCaseResponse = Either<
  OrderNotFoundError | DeliveryManNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class WithdrawOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliveryManRepository: DeliveryManRepository,
  ) {}

  async execute({
    deliveryManId,
    orderId,
  }: WithdrawOrderUseCaseRequest): Promise<WithdrawOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new OrderNotFoundError())
    }

    const deliveryMan = await this.deliveryManRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new DeliveryManNotFoundError())
    }

    order.deliveryManId = deliveryMan.id
    order.status = OrderStatus.WITHDRAWN

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
