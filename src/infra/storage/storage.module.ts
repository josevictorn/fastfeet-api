import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { R2Storage } from './r2-storage'
import { Uploader } from '@/domain/delivery/application/storage/uploader'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
