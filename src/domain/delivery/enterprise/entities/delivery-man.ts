import { Entity } from '@/core/entity/entity'
import { UniqueEntityID } from '@/core/entity/unique-entity-id'

export interface DeliveryManProps {
  name: string
  cpf: string
  password: string
}

export class DeliveryMan extends Entity<DeliveryManProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  set name(name: string) {
    this.props.name = name
  }

  set cpf(cpf: string) {
    this.props.cpf = cpf
  }

  set password(password: string) {
    this.props.password = password
  }

  static create(props: DeliveryManProps, id?: UniqueEntityID) {
    const deliveryMan = new DeliveryMan(props, id)

    return deliveryMan
  }
}
