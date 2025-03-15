import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnOrderStatusUpdated } from '@/domain/notification/application/subscribers/on-order-status-updated'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

@Module({
  imports: [DatabaseModule],
  providers: [OnOrderStatusUpdated, SendNotificationUseCase],
})
export class EventsModule {}
