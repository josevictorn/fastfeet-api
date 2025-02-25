import { DeliveryMan } from '@/domain/delivery/enterprise/entities/delivery-man'

export class DeliveryManPresenter {
  static toHTTP(deliveryMan: DeliveryMan) {
    return {
      id: deliveryMan.id.toString(),
      cpf: deliveryMan.cpf,
      name: deliveryMan.name,
    }
  }
}
