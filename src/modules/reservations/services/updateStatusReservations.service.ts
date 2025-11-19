import { Inject, Injectable } from "@nestjs/common";
import { REPOSITORY_TOKEN_RESERVATION } from "../utils/repositoriesToken";
import type { IReservationRepository } from "../domain/repositories/Ireservations.repository";
import { ReservationStatus } from "@prisma/client";
import { UserService } from "src/modules/users/user.service";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class UpdateStatusReservationsService {
    constructor(
        @Inject(REPOSITORY_TOKEN_RESERVATION)
        private readonly reservationRepository: IReservationRepository,
        private readonly mailerService: MailerService,
        private readonly userService: UserService
    ) {}

    async execute(id:number, status: ReservationStatus) {
        const reservation = await this.reservationRepository.updateStatus(
            id,
            status,
        )
        const user = await this.userService.show(reservation.userId)

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Reservation Status Update',
            html:  '<p>Você tem uma nova reserva pendente para aprovação.</p>'
        })

        return reservation
    }
}