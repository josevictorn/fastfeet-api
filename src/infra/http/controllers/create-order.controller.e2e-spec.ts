import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { OrderStatus } from '@prisma/client'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Create Recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let deliveryManFactory: DeliveryManFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory, DeliveryManFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('An admin it should be able create an order', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const recipient = await recipientFactory.makePrismaRecipient()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: recipient.id.toString(),
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.order.findFirst({
      where: {
        recipientId: recipient.id.toString(),
        status: OrderStatus.PENDING,
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })

  test('A delivery man it should not be able create an order', async () => {
    const user = await deliveryManFactory.makePrismaDeliveryMan()

    const recipient = await recipientFactory.makePrismaRecipient()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: recipient.id.toString(),
      })

    expect(response.statusCode).toBe(403)
  })
})
