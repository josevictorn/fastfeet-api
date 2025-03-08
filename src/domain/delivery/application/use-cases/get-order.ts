import { Either, left, right } from '@/core/either'
import { OrderNotFoundError } from './erros/order-not-found-error'
import { OrdersRepository } from '../repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import { Order } from '../../enterprise/entities/order'

interface GetOrderUseCaseRequest {
  id: string
}

type GetOrderUseCaseResponse = Either<
  OrderNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class GetOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    id,
  }: GetOrderUseCaseRequest): Promise<GetOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(id)

    if (!order) {
      return left(new OrderNotFoundError())
    }

    return right({
      order,
    })
  }
}
