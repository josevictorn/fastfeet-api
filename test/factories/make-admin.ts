import { UniqueEntityID } from '@/core/entity/unique-entity-id'
import { Admin, AdminProps } from '@/domain/delivery/enterprise/entities/admin'
import { faker } from '@faker-js/faker/locale/pt_BR'

function generateCPF(): string {
  const randomNumbers = faker.string.numeric(9) // Gera os 9 primeiros dígitos aleatórios
  const cpfBase = randomNumbers.split('').map(Number)

  // Função para calcular os dígitos verificadores
  function calculateDigit(cpfArray: number[]): number {
    const sum = cpfArray.reduce(
      (total, num, index) => total + num * (cpfArray.length + 1 - index),
      0,
    )
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }

  // Calcula os dois últimos dígitos
  const firstDigit = calculateDigit(cpfBase)
  cpfBase.push(firstDigit)
  const secondDigit = calculateDigit(cpfBase)
  cpfBase.push(secondDigit)

  // Retorna o CPF formatado
  return cpfBase.join('')
}

export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      cpf: generateCPF(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return admin
}
