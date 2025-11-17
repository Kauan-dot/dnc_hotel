import { Inject, Injectable } from "@nestjs/common";
import { REPOSITORY_TOKEN_RESERVATION } from "../utils/repositoriesToken";
import type { IReservationRepository } from "../domain/repositories/Ireservations.repository";

@Injectable()
export class FindAllReservationsService {
    constructor(
        @Inject(REPOSITORY_TOKEN_RESERVATION)
        private readonly reservationRepository: IReservationRepository,
    ) {}

    async execute() {
        return this.reservationRepository.findAll()
    }
}