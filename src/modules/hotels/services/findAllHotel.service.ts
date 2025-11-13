import { Inject, Injectable } from '@nestjs/common';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repositorie';
import { resourceLimits } from 'worker_threads';

@Injectable()
export class FindAllHotelsService {
  constructor(
      @Inject(HOTEL_REPOSITORY_TOKEN)
      private readonly hotelRepositories: IHotelRepository,
  ) {}

  async execute(page: number = 1, limit: number = 10) {
    const offSet = (page - 1) * limit;
    const data =  await this.hotelRepositories.findHotels(offSet, limit);

    const total = await this.hotelRepositories.countHotels();

    return {
      total,
      page,
      per_page: limit,
      data,
    }
  }
}
