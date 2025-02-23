import { DeliveryMan } from '../../enterprise/entities/delivery-man'

export abstract class DeliveryManRepository {
  abstract findByCpf(cpf: string): Promise<DeliveryMan | null>
  abstract create(deliveryMan: DeliveryMan): Promise<void>
}
