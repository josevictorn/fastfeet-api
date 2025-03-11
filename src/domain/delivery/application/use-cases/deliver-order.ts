import { Either, left, right } from '@/core/either'
import { OrderNotFoundError } from './erros/order-not-found-error'
import { Order } from '../../enterprise/entities/order'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders-repository'
import { OrderAttachment } from '../../enterprise/entities/order-attachment'
import { UniqueEntityID } from '@/core/entity/unique-entity-id'
import { OrderStatus } from '@/core/enums/order-status'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface DeliverOrderUseCaseRequest {
  attachmentId: string
  deliveryManId: string
  orderId: string
}

type DeliverOrderUseCaseResponse = Either<
  OrderNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

@Injectable()
export class DeliverOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    attachmentId,
    deliveryManId,
    orderId,
  }: DeliverOrderUseCaseRequest): Promise<DeliverOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new OrderNotFoundError())
    }

    if (deliveryManId !== order.deliveryManId?.toString()) {
      return left(new NotAllowedError())
    }

    const orderAttachment = OrderAttachment.create({
      attachmentId: new UniqueEntityID(attachmentId),
      orderId: order.id,
    })

    order.attachment = orderAttachment
    order.status = OrderStatus.DELIVERED

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
