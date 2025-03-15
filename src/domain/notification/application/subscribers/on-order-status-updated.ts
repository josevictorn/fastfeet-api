import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { OrderStatusUpdatedEvent } from '@/domain/delivery/enterprise/events/order-status-updated-event'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnOrderStatusUpdated implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderUpdatedStatusNotification.bind(this),
      OrderStatusUpdatedEvent.name,
    )
  }

  private async sendOrderUpdatedStatusNotification({
    order,
  }: OrderStatusUpdatedEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: `Order "${order.id.toString()}"`,
      content: `The order status has been updated to "${order.status}"`,
    })
  }
}
