import { Entity } from '@/core/entity/entity'
import { UniqueEntityID } from '@/core/entity/unique-entity-id'

export interface AdminProps {
  name: string
  cpf: string
  password: string
}

export class Admin extends Entity<AdminProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  static create(props: AdminProps, id?: UniqueEntityID) {
    const admin = new Admin(props, id)

    return admin
  }
}
