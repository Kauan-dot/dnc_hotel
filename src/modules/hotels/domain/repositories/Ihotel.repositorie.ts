import { Hotel } from "@prisma/client";
import { CreateHotelDto } from "../dto/create-hotel.dto";
import { UpdateHotelDto } from "../dto/update-hotel.dto";

export interface IHotelRepository {
    createHotel(data: CreateHotelDto, id: number): Promise<Hotel>;
    findHotelById(id: number): Promise<Hotel | null>;
    findHotelByName(name: string): Promise<Hotel[] | null>;
    findHotels(offSet: number, limit: number): Promise<Hotel[]>;
    updateHotel(id: number, data: UpdateHotelDto): Promise<Hotel>;
    deleteHotel(id: number): Promise<Hotel>;
    findHotelByOwner(ownerId: number): Promise<Hotel[]>;
    countHotels(): Promise<number>;
}