import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { MockInstance } from 'vitest'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { OrderStatus } from '@/core/enums/order-status'
import { waitFor } from 'test/utils/wait-for'
import { OnOrderStatusUpdated } from './on-order-status-updated'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Order Status Updated', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
    )
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnOrderStatusUpdated(sendNotificationUseCase)
  })

  it('must send a notification when the order status changes', async () => {
    const recipient = makeRecipient()
    const order = makeOrder({ recipientId: recipient.id })

    inMemoryRecipientsRepository.create(recipient)
    inMemoryOrdersRepository.create(order)

    order.status = OrderStatus.WITHDRAWN

    inMemoryOrdersRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
