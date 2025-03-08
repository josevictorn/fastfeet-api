import { Either, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { Injectable } from '@nestjs/common'

interface FetchOrdersFromDeliveryManUseCaseRequest {
  deliveryManId: string
  page: number
}

type FetchOrdersFromDeliveryManUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchOrdersFromDeliveryMan {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    deliveryManId,
    page,
  }: FetchOrdersFromDeliveryManUseCaseRequest): Promise<FetchOrdersFromDeliveryManUseCaseResponse> {
    const orders = await this.ordersRepository.findManyByDeliveryManId(
      deliveryManId,
      { page },
    )

    return right({
      orders,
    })
  }
}
