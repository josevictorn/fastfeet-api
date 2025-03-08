import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { UniqueEntityID } from '@/core/entity/unique-entity-id'
import { OrderStatus } from '@/core/enums/order-status'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientNotFoundError } from './erros/recipient-not-found-error'
import { Injectable } from '@nestjs/common'

interface CreateOrderUseCaseRequest {
  recipientId: string
}

type CreateOrderUseCaseResponse = Either<
  RecipientNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    recipientId,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new RecipientNotFoundError())
    }

    const order = Order.create({
      status: OrderStatus.PENDING,
      recipientId: new UniqueEntityID(recipientId),
    })

    await this.ordersRepository.create(order)

    return right({
      order,
    })
  }
}
