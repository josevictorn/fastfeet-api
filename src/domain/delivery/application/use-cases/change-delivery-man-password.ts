import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliveryMan } from '../../enterprise/entities/delivery-man'
import { DeliveryManRepository } from '../repositories/delivery-man-repository'
import { DeliveryManNotFoundError } from './erros/delivery-man-not-found-error'

interface ChangeDeliveryManPasswordUseCaseRequest {
  deliveryManId: string
  password: string
}

type ChangeDeliveryManPasswordUseCaseResponse = Either<
  DeliveryManNotFoundError,
  {
    deliveryMan: DeliveryMan
  }
>

@Injectable()
export class ChangeDeliveryManPasswordUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    deliveryManId,
    password,
  }: ChangeDeliveryManPasswordUseCaseRequest): Promise<ChangeDeliveryManPasswordUseCaseResponse> {
    const deliveryMan = await this.deliveryManRepository.findById(deliveryManId)

    if (deliveryManId !== deliveryMan?.id.toString()) {
      return left(new DeliveryManNotFoundError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    deliveryMan.password = hashedPassword

    await this.deliveryManRepository.save(deliveryMan)

    return right({
      deliveryMan,
    })
  }
}
