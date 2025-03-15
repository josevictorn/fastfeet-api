import { UniqueEntityID } from '../entity/unique-entity-id'

export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueEntityID
}
