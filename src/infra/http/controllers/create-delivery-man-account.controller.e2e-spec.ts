import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'

describe('Create Delivery Man Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let deliveryManFactory: DeliveryManFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliveryManFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('An admin it should be able create a delivery man', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/accounts/delivery-man')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        cpf: '75206809081',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '75206809081',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })

  test('An delivery man it should not be able create a other delivery man', async () => {
    const user = await deliveryManFactory.makePrismaDeliveryMan()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/accounts/delivery-man')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        cpf: '75206809081',
        password: '123456',
      })

    expect(response.statusCode).toBe(403)
  })
})
