import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { AdminsRepository } from '@/domain/delivery/application/repositories/admins-repository'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { DeliveryManRepository } from '@/domain/delivery/application/repositories/delivery-man-repository'
import { PrismaDeliveryManRepository } from './prisma/repositories/prisma-delivery-man-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    {
      provide: DeliveryManRepository,
      useClass: PrismaDeliveryManRepository,
    },
  ],
  exports: [PrismaService, AdminsRepository, DeliveryManRepository],
})
export class DatabaseModule {}
