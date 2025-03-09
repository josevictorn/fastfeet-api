import { OrderCode } from '@/domain/delivery/enterprise/entities/order-code'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Fetch Orders From Delivery Man (E2E)', () => {
  let app: INestApplication
  let deliveryManFactory: DeliveryManFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DeliveryManFactory,
        AdminFactory,
        OrderFactory,
        RecipientFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('An delivery man it should be able fetch your orders', async () => {
    const user = await deliveryManFactory.makePrismaDeliveryMan()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      orderFactory.makePrismaOrder({
        code: new OrderCode('#123ABC45'),
        recipientId: recipient.id,
        deliveryManId: user.id,
      }),
      orderFactory.makePrismaOrder({
        code: new OrderCode('#789ABC10'),
        recipientId: recipient.id,
        deliveryManId: user.id,
      }),
      orderFactory.makePrismaOrder({
        code: new OrderCode('#111ABC21'),
        recipientId: recipient.id,
        deliveryManId: user.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/delivery-man/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({
          code: '#123ABC45',
        }),
        expect.objectContaining({
          code: '#789ABC10',
        }),
        expect.objectContaining({
          code: '#111ABC21',
        }),
      ]),
    })
  })

  test('An delivery man it should not be able fetch orders of others delivery man', async () => {
    const user = await deliveryManFactory.makePrismaDeliveryMan()

    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      orderFactory.makePrismaOrder({
        code: new OrderCode('#123ABC45'),
        recipientId: recipient.id,
        deliveryManId: deliveryMan.id,
      }),
      orderFactory.makePrismaOrder({
        code: new OrderCode('#789ABC10'),
        recipientId: recipient.id,
        deliveryManId: deliveryMan.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/delivery-man/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      orders: [],
    })
  })
})
