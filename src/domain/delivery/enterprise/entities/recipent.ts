import { Entity } from '@/core/entity/entity'
import { UniqueEntityID } from '@/core/entity/unique-entity-id'

export interface RecipientProps {
  name: string
  street: string
  number: number
  complement?: string | null
  state: string
  zipCode: string
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.name
  }

  get street() {
    return this.street
  }

  get number() {
    return this.number
  }

  get complement() {
    return this.complement
  }

  get state() {
    return this.state
  }

  get zipCode() {
    return this.zipCode
  }

  set name(name: string) {
    this.name = name
  }

  set street(street: string) {
    this.street = street
  }

  set number(number: number) {
    this.number = number
  }

  set complement(complement: string) {
    this.name = complement
  }

  set state(state: string) {
    this.name = state
  }

  set zipCode(zipCode: string) {
    this.name = zipCode
  }

  static create(props: RecipientProps, id?: UniqueEntityID) {
    const recipient = new Recipient(props, id)

    return recipient
  }
}
