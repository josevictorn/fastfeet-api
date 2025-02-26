import { Either, right } from '@/core/either'
import { DeliveryManRepository } from '../repositories/delivery-man-repository'
import { DeliveryMan } from '../../enterprise/entities/delivery-man'
import { Injectable } from '@nestjs/common'

interface FetchDeliveryManUseCaseRequest {
  page: number
}

type FetchDeliveryManUseCaseResponse = Either<
  null,
  {
    deliveryMan: DeliveryMan[]
  }
>

@Injectable()
export class FetchDeliveryManUseCase {
  constructor(private deliveryManRepository: DeliveryManRepository) {}

  async execute({
    page,
  }: FetchDeliveryManUseCaseRequest): Promise<FetchDeliveryManUseCaseResponse> {
    const deliveryMan = await this.deliveryManRepository.findMany({ page })

    return right({
      deliveryMan,
    })
  }
}
