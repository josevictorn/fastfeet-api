import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Fetch Recipients (E2E)', () => {
  let app: INestApplication
  let deliveryManFactory: DeliveryManFactory
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryManFactory, AdminFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('An admin it should be able fetch recipients', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      recipientFactory.makePrismaRecipient({
        name: 'Lucas Donovan',
      }),
      recipientFactory.makePrismaRecipient({
        name: 'Sophie Caldwell',
      }),
      recipientFactory.makePrismaRecipient({
        name: 'Ethan Mercer',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      recipients: expect.arrayContaining([
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

  test('An delivery man it should not be able fetch recipients', async () => {
    const user = await deliveryManFactory.makePrismaDeliveryMan()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      recipientFactory.makePrismaRecipient({
        name: 'Lucas Donovan',
      }),
      recipientFactory.makePrismaRecipient({
        name: 'Sophie Caldwell',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(403)
  })
})
