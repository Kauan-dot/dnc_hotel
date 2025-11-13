import { Inject, Injectable } from '@nestjs/common';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repositorie';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';

@Injectable()
export class FindOneHotelsService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepositories: IHotelRepository
  ) {}

  async execute(id: number) {
    return await this.hotelRepositories.findHotelById(id);
  }
}
