import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { OrderStatus } from '@prisma/client'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Deliver Order (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let deliveryManFactory: DeliveryManFactory
  let orderFactory: OrderFactory
  let recipientFactory: RecipientFactory
  let attachmentFactory: AttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        DeliveryManFactory,
        OrderFactory,
        RecipientFactory,
        AttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('A delivery man it should be able deliver order', async () => {
    const user = await deliveryManFactory.makePrismaDeliveryMan()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      deliveryManId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/deliver`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachmentId: attachment.id.toString(),
      })

    expect(response.statusCode).toBe(204)

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: order.id.toString(),
      },
    })

    expect(orderOnDatabase).toBeTruthy()
    expect(orderOnDatabase).toMatchObject({
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      deliveryManId: user.id.toString(),
      status: OrderStatus.DELIVERED,
    })

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        orderId: orderOnDatabase?.id,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(1)
  })

  test('An admin it should not be able deliver order', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      deliveryManId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/pick-up`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachmentId: attachment.id.toString(),
      })

    expect(response.statusCode).toBe(403)
  })
})
