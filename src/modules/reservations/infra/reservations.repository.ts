import { Injectable } from "@nestjs/common";
import { IReservationRepository } from "../domain/repositories/Ireservations.repository";
import { Reservation } from "@prisma/client";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Injectable()
export class ReservationRepository implements IReservationRepository {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    create(data: any): Promise<Reservation> {
        return this.prisma.reservation.create({ data })
    }

    findById(id: number): Promise<Reservation | null> {
        return this.prisma.reservation.findUnique({where: {id }})
    }

    findAll(): Promise<Reservation[]> {
        throw new Error("Method not implemented.");
    }

    findByUser(userId: number): Promise<Reservation[]> {
        return this.prisma.reservation.findMany({where: { userId }})
    }
    
}