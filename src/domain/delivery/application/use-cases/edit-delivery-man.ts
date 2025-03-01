import { Either, left, right } from '@/core/either'
import { DeliveryManRepository } from '../repositories/delivery-man-repository'
import { DeliveryManNotFoundError } from './erros/delivery-man-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { DeliveryMan } from '../../enterprise/entities/delivery-man'
import { Injectable } from '@nestjs/common'

interface EditDeliveryManUseCaseRequest {
  deliveryManId: string
  name?: string
  cpf?: string
}

type EditDeliveryManUseCaseResponse = Either<
  DeliveryManNotFoundError | NotAllowedError,
  {
    deliveryMan: DeliveryMan
  }
>

@Injectable()
export class EditDeliveryManUseCase {
  constructor(private deliveryManRepository: DeliveryManRepository) {}

  async execute({
    deliveryManId,
    name,
    cpf,
  }: EditDeliveryManUseCaseRequest): Promise<EditDeliveryManUseCaseResponse> {
    const deliveryMan = await this.deliveryManRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new DeliveryManNotFoundError())
    }

    if (deliveryManId !== deliveryMan.id.toString()) {
      return left(new NotAllowedError())
    }

    deliveryMan.name = name || deliveryMan.name
    deliveryMan.cpf = cpf || deliveryMan.cpf

    await this.deliveryManRepository.save(deliveryMan)

    return right({
      deliveryMan,
    })
  }
}
