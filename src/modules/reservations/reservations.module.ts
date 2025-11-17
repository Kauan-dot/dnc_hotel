import { Module } from '@nestjs/common';
import { ReservationsController } from './infra/reservations.controller';
import { CreateReservationsService } from './services/createReservations.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { HotelsModule } from '../hotels/hotels.module';
import { REPOSITORY_TOKEN_RESERVATION } from './utils/repositoriesToken';
import { ReservationRepository } from './infra/reservations.repository';
import { HOTEL_REPOSITORY_TOKEN } from '../hotels/utils/repositoriesTokens';
import { HotelsRepositories } from '../hotels/infra/hotels.repository';
import { FindAllReservationsService } from './services/findAllReservations.service';
import { FindByIdReservationsService } from './services/findByIdReservations.service';
import { FindByUserReservationsService } from './services/findByUserReservations.service';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, HotelsModule],
  controllers: [ReservationsController],
  providers: [
    CreateReservationsService, 
    FindAllReservationsService,
    FindByIdReservationsService,
    FindByUserReservationsService,

    {
      provide: REPOSITORY_TOKEN_RESERVATION,
      useClass: ReservationRepository,
    },
    {
      provide: HOTEL_REPOSITORY_TOKEN,
      useClass: HotelsRepositories,
    },
  ],
})
export class ReservationsModule {}
