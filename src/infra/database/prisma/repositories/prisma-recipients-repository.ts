import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository'
import { PrismaService } from '../prisma.service'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipent'
import { PrismaRecipientMapper } from '../mappers/prisma-recipients-mapper'
import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        email,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async findById(recipientId: string) {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id: recipientId,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async findMany({ page }: PaginationParams) {
    const recipient = await this.prisma.recipient.findMany({
      take: 20,
      skip: (page - 1) & 20,
    })

    return recipient.map(PrismaRecipientMapper.toDomain)
  }

  async create(recipient: Recipient) {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.create({
      data,
    })
  }

  async save(recipient: Recipient) {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(recipient: Recipient) {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.delete({
      where: {
        id: data.id,
      },
    })
  }
}
