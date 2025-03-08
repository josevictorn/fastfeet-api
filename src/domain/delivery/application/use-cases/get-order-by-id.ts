import { Either, left, right } from '@/core/either'
import { OrderNotFoundError } from './erros/order-not-found-error'
import { OrdersRepository } from '../repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import { Order } from '../../enterprise/entities/order'

interface GetOrderByIdUseCaseRequest {
  id: string
}

type GetOrderByIdUseCaseResponse = Either<
  OrderNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class GetOrderByIdUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    id,
  }: GetOrderByIdUseCaseRequest): Promise<GetOrderByIdUseCaseResponse> {
    const order = await this.ordersRepository.findById(id)

    if (!order) {
      return left(new OrderNotFoundError())
    }

    return right({
      order,
    })
  }
}
