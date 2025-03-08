import { Order } from '@/domain/delivery/enterprise/entities/order'

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      code: order.code.toString(),
      status: order.status,
      deliveryManId: order.deliveryManId?.toString(),
      recipientId: order.recipientId.toString(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
