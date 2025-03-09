import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import request from 'supertest'

describe('Upload attachment (E2E)', () => {
  let app: INestApplication
  let deliveryManFactory: DeliveryManFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryManFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliveryManFactory = moduleRef.get(DeliveryManFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /attachments', async () => {
    const user = await deliveryManFactory.makePrismaDeliveryMan()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.png')

    console.log(response.body)
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    })
  })
})
