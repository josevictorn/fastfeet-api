import { Entity } from '@/core/entity/entity'
import { UniqueEntityID } from '@/core/entity/unique-entity-id'

export interface RecipientProps {
  name: string
  email: string
  street: string
  number: number
  complement?: string | null
  state: string
  zipCode: string
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get street() {
    return this.props.street
  }

  get number() {
    return this.props.number
  }

  get complement() {
    return this.props.complement
  }

  get state() {
    return this.props.state
  }

  get zipCode() {
    return this.props.zipCode
  }

  set name(name: string) {
    this.props.name = name
  }

  set email(email: string) {
    this.props.email = email
  }

  set street(street: string) {
    this.props.street = street
  }

  set number(number: number) {
    this.props.number = number
  }

  set complement(complement: string | null | undefined) {
    this.props.complement = complement
  }

  set state(state: string) {
    this.props.state = state
  }

  set zipCode(zipCode: string) {
    this.props.zipCode = zipCode
  }

  static create(props: RecipientProps, id?: UniqueEntityID) {
    const recipient = new Recipient(props, id)

    return recipient
  }
}
