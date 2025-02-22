import { HashComparer } from '@/domain/delivery/aplication/cryptography/hash-comparer'
import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'
import { HashGenerator } from '@/domain/delivery/aplication/cryptography/hash-generator'

@Module({
  providers: [
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [HashComparer, HashGenerator],
})
export class CryptographyModule {}
