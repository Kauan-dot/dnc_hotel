import { Inject, Injectable } from '@nestjs/common';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repositorie';

@Injectable()
export class UpdateHotelsService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepositories: IHotelRepository,
  ) {}

  async execute(id: number, updateHotelDto: UpdateHotelDto) {
    return await this.hotelRepositories.updateHotel(id, updateHotelDto);
  }
}
