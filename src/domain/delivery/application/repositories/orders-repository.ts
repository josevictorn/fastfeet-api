import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/order'

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findMany(params: PaginationParams): Promise<Order[]>
  abstract findManyByDeliveryManId(
    deliveryManId: string,
    params: PaginationParams,
  ): Promise<Order[]>

  abstract findManyByRecipientId(
    recipientId: string,
    params: PaginationParams,
  ): Promise<Order[]>

  abstract create(order: Order): Promise<void>
  abstract save(order: Order): Promise<void>
}
