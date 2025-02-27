import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliveryMan } from '../../enterprise/entities/delivery-man'

export abstract class DeliveryManRepository {
  abstract findByCpf(cpf: string): Promise<DeliveryMan | null>
  abstract findById(id: string): Promise<DeliveryMan | null>
  abstract findMany(params: PaginationParams): Promise<DeliveryMan[]>
  abstract create(deliveryMan: DeliveryMan): Promise<void>
  abstract save(deliveryMan: DeliveryMan): Promise<void>
}
