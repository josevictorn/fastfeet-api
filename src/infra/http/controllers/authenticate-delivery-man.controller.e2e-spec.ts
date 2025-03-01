import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'

describe('Authenticate Delivery Man (E2E)', () => {
  let app: INestApplication
  let deliveryManFactory: DeliveryManFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryManFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliveryManFactory = moduleRef.get(DeliveryManFactory)

    await app.init()
  })

  test('[POST] /sessions/delivery-man', async () => {
    await deliveryManFactory.makePrismaDeliveryMan({
      cpf: '75206809080',
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer())
      .post('/sessions/delivery-man')
      .send({
        cpf: '75206809080',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
