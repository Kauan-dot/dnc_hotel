import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { REPOSITORY_TOKEN_RESERVATION } from '../utils/repositoriesToken';
import type { IReservationRepository } from '../domain/repositories/Ireservations.repository';
import { differenceInDays, parseISO } from 'date-fns'
import type { IHotelRepository } from 'src/modules/hotels/domain/repositories/Ihotel.repositorie';
import { Reservation, ReservationStatus } from '@prisma/client';
import { HOTEL_REPOSITORY_TOKEN } from 'src/modules/hotels/utils/repositoriesTokens';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/modules/users/user.service';

@Injectable()
export class CreateReservationsService {
  constructor(
    @Inject(REPOSITORY_TOKEN_RESERVATION)
    private readonly reservatioRepository: IReservationRepository,
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelsRepository: IHotelRepository,
    private readonly mailerService: MailerService,
    private readonly userervice: UserService,
  ) {}
  async create(id: number, data: CreateReservationDto) {
    const checkInDate = parseISO(data.checkIn)
    const checkOutDate = parseISO(data.checkOut)
    const daysOfStay = differenceInDays(checkOutDate, checkInDate);

    if(checkInDate >= checkOutDate) {
      throw new BadRequestException(
        'Check-out date must be after check-in date.',
      )
    }

    const hotel = await this.hotelsRepository.findHotelById(data.hotelId);

    if(!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    if (typeof hotel.price !== 'number' || hotel.price <= 0) {
      throw new BadRequestException('Invalid hotel price.');
    }

    const total = daysOfStay * hotel.price;

    const newReservation = {
      ...data,
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      total,
      userId: id,
      status: ReservationStatus.PENDING,
    };

    const hotelOwner = await this.userervice.show(hotel.ownerId)

    await this.mailerService.sendMail({
      to: hotelOwner.email,
      subject: 'Pending Reservation Approval',
      html: '<p>Você tem uma nova reserva pendente para aprovação.</p>'
    })

    return this.reservatioRepository.create(newReservation)
  }
}
