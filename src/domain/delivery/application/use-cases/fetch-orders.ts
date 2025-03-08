import { Either, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'

interface FetchOrdersUseCaseRequest {
  page: number
}

type FetchOrdersUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

export class FetchOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    page,
  }: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findMany({ page })

    return right({
      orders,
    })
  }
}
