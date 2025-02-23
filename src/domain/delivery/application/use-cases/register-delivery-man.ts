import { Either, left, right } from '@/core/either'
import { DeliveryMan } from '../../enterprise/entities/delivery-man'
import { DeliveryManAlreadyExistsError } from './erros/delivery-man-already-exists-error'
import { DeliveryManRepository } from '../repositories/delivery-man-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { Injectable } from '@nestjs/common'

interface RegisterDeliveryManUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type RegisterDeliveryManUseCaseResponse = Either<
  DeliveryManAlreadyExistsError,
  {
    deliveryMan: DeliveryMan
  }
>

@Injectable()
export class RegisterDeliveryManUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    cpf,
    name,
    password,
  }: RegisterDeliveryManUseCaseRequest): Promise<RegisterDeliveryManUseCaseResponse> {
    const deliveryManWithSameCpf =
      await this.deliveryManRepository.findByCpf(cpf)

    if (deliveryManWithSameCpf) {
      return left(new DeliveryManAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryMan = DeliveryMan.create({
      name,
      cpf,
      password: hashedPassword,
    })

    await this.deliveryManRepository.create(deliveryMan)

    return right({
      deliveryMan,
    })
  }
}
