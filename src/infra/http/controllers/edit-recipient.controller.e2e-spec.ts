import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Edit Recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let deliveryManFactory: DeliveryManFactory
  let recipientFactory: RecipientFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliveryManFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('An admin it should be able edit a recipient', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const response = await request(app.getHttpServer())
      .patch(`/recipients/${recipient.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'johndoe@email.com',
        state: 'RN',
        city: 'Natal',
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.recipient.findUnique({
      where: {
        id: recipient.id.toString(),
      },
    })

    expect(userOnDatabase).toBeTruthy()
    expect(userOnDatabase).toEqual({
      id: recipient.id.toString(),
      email: 'johndoe@email.com',
      name: 'John Doe',
      street: recipient.street,
      complement: null,
      number: recipient.number,
      city: 'Natal',
      state: 'RN',
      zipCode: recipient.zipCode,
    })
  })

  test('An delivery man it should not be able edit a recipient', async () => {
    const user = await deliveryManFactory.makePrismaDeliveryMan()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const response = await request(app.getHttpServer())
      .patch(`/recipients/${recipient.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'johndoe@email.com',
        state: 'RN',
        city: 'Natal',
      })

    expect(response.statusCode).toBe(403)
  })
})
