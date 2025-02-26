import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'

describe('Feych Delivery Man (E2E)', () => {
  let app: INestApplication
  let deliveryManFactory: DeliveryManFactory
  let adminFactory: AdminFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryManFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    adminFactory = moduleRef.get(AdminFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('An admin it should be able fetch delivery man', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      deliveryManFactory.makePrismaDeliveryMan({
        name: 'Lucas Donovan',
      }),
      deliveryManFactory.makePrismaDeliveryMan({
        name: 'Sophie Caldwell',
      }),
      deliveryManFactory.makePrismaDeliveryMan({
        name: 'Ethan Mercer',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/accounts/delivery-man')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliveryMan: expect.arrayContaining([
        expect.objectContaining({
          name: 'Lucas Donovan',
        }),
        expect.objectContaining({
          name: 'Sophie Caldwell',
        }),
        expect.objectContaining({
          name: 'Ethan Mercer',
        }),
      ]),
    })
  })

  test('An delivery man it should not be able fetch others delivery man', async () => {
    const user = await deliveryManFactory.makePrismaDeliveryMan()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      deliveryManFactory.makePrismaDeliveryMan({
        name: 'Lucas Donovan',
      }),
      deliveryManFactory.makePrismaDeliveryMan({
        name: 'Sophie Caldwell',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/accounts/delivery-man')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(403)
  })
})
