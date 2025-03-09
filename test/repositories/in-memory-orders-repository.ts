import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository'
import { Order } from '@/domain/delivery/enterprise/entities/order'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findMany({ page }: PaginationParams) {
    const orders = this.items.slice((page - 1) * 20, page * 20)

    return orders
  }

  async findManyByDeliveryManId(
    deliveryManId: string,
    { page }: PaginationParams,
  ) {
    const orders = this.items
      .filter((item) => item.deliveryManId?.toString() === deliveryManId)
      .slice((page - 1) * 20, page * 20)

    return orders
  }

  async findManyByRecipientId(RecipientId: string, { page }: PaginationParams) {
    const orders = this.items
      .filter((item) => item.recipientId?.toString() === RecipientId)
      .slice((page - 1) * 20, page * 20)

    return orders
  }

  async create(order: Order) {
    this.items.push(order)
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order
  }
}
