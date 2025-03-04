import crypto from 'crypto'

export class OrderCode {
  private code: string

  toString() {
    return this.code
  }

  toValue() {
    return this.code
  }

  constructor(code?: string) {
    const randomBytes = crypto.randomUUID().replace(/-/g, '')
    const hexNumber = BigInt(`0x${randomBytes}`)
    const value = '#' + hexNumber.toString(36).substring(0, 8).toUpperCase()

    this.code = code ?? value
  }

  equals(code: OrderCode) {
    return code.toValue() === this.code
  }
}
