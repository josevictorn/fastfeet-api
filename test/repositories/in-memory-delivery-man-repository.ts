import { DeliveryManRepository } from '@/domain/delivery/application/repositories/delivery-man-repository'
import { DeliveryMan } from '@/domain/delivery/enterprise/entities/delivery-man'

export class InMemoryDeliveryManRepository implements DeliveryManRepository {
  public items: DeliveryMan[] = []

  async findByCpf(cpf: string) {
    const deliveryMan = this.items.find((item) => item.cpf === cpf)

    if (!deliveryMan) {
      return null
    }

    return deliveryMan
  }

  async create(deliveryMan: DeliveryMan) {
    this.items.push(deliveryMan)
  }

  async findById(id: string) {
    const deliveryMan = this.items.find((item) => item.id.toString() === id)

    if (!deliveryMan) {
      return null
    }

    return deliveryMan
  }
}
