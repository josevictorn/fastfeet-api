import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'

describe('Change Delivery Man Password (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let deliveryManFactory: DeliveryManFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliveryManFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('An admin it should be able to change password of a delivery man', async () => {
    const user = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()

    const response = await request(app.getHttpServer())
      .patch(
        `/accounts/delivery-man/${deliveryMan.id.toString()}/change-password`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: '654321',
      })

    expect(response.statusCode).toBe(204)
  })

  test('A delivery man it should not be able to change another delivery man password', async () => {
    const user = await deliveryManFactory.makePrismaDeliveryMan()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const deliveryMan = await deliveryManFactory.makePrismaDeliveryMan()

    const response = await request(app.getHttpServer())
      .patch(
        `/accounts/delivery-man/${deliveryMan.id.toString()}/change-password`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: '654321',
      })

    expect(response.statusCode).toBe(403)
  })
})
