import { Either, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { Injectable } from '@nestjs/common'

interface FetchOrdersFromRecipientUseCaseRequest {
  recipientId: string
  page: number
}

type FetchOrdersFromRecipientUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchOrdersFromRecipientUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    recipientId,
    page,
  }: FetchOrdersFromRecipientUseCaseRequest): Promise<FetchOrdersFromRecipientUseCaseResponse> {
    const orders = await this.ordersRepository.findManyByRecipientId(
      recipientId,
      { page },
    )

    return right({
      orders,
    })
  }
}
