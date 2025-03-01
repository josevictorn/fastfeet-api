import { Either, left, right } from '@/core/either'
import { DeliveryManNotFoundError } from './erros/delivery-man-not-found-error'
import { DeliveryManRepository } from '../repositories/delivery-man-repository'
import { Injectable } from '@nestjs/common'

interface DeleteDeliveryManRequest {
  deliveryManId: string
}

type DeleteDeliveryManResponse = Either<DeliveryManNotFoundError, null>

@Injectable()
export class DeleteDeliveryManUseCase {
  constructor(private deliveryManRepository: DeliveryManRepository) {}

  async execute({
    deliveryManId,
  }: DeleteDeliveryManRequest): Promise<DeleteDeliveryManResponse> {
    const deliveryMan = await this.deliveryManRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new DeliveryManNotFoundError())
    }

    await this.deliveryManRepository.delete(deliveryMan)

    return right(null)
  }
}
