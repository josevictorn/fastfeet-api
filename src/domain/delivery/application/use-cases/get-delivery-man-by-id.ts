import { Either, left, right } from '@/core/either'
import { DeliveryManNotFoundError } from './erros/delivery-man-not-found-error'
import { DeliveryMan } from '../../enterprise/entities/delivery-man'
import { DeliveryManRepository } from '../repositories/delivery-man-repository'
import { Injectable } from '@nestjs/common'

interface GetDeliveryManByIdUseCaseResquest {
  id: string
}

type GetDeliveryManByIdUseCaseResponse = Either<
  DeliveryManNotFoundError,
  {
    deliveryMan: DeliveryMan
  }
>

@Injectable()
export class GetDeliveryManByIdUseCase {
  constructor(private deliveryManRepository: DeliveryManRepository) {}

  async execute({
    id,
  }: GetDeliveryManByIdUseCaseResquest): Promise<GetDeliveryManByIdUseCaseResponse> {
    const deliveryMan = await this.deliveryManRepository.findById(id)

    if (!deliveryMan) {
      return left(new DeliveryManNotFoundError())
    }

    return right({
      deliveryMan,
    })
  }
}
