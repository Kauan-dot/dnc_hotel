import { Inject, Injectable } from '@nestjs/common';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repositorie';

@Injectable()
export class RemoveHotelsService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepositories: IHotelRepository,
  ) {}

  execute(id: number) {
    return this.hotelRepositories.deleteHotel(id)
  }
}
