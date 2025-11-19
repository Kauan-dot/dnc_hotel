import { Inject, Injectable } from '@nestjs/common';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repositorie';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';

@Injectable()
export class CreateHotelsService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepositories: IHotelRepository,
    @InjectRedis()
      private readonly redis: Redis,
  ) {}

  async execute(createHotelDto: CreateHotelDto, id: number) {
    await this.redis.del(REDIS_HOTEL_KEY)
    return await this.hotelRepositories.createHotel(createHotelDto, id);
  }
}
