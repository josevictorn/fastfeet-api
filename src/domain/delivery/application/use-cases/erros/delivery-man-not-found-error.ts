import { UseCaseError } from '@/core/errors/use-case-error'

export class DeliveryManNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Delivery man not found')
  }
}
