import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateReservationsService } from '../services/createReservations.service';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { FindAllReservationsService } from '../services/findAllReservations.service';
import { ParamId } from 'src/shared/decorators/paramId.decorator';
import { FindByIdReservationsService } from '../services/findByIdReservations.service';

@UseGuards(AuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly createReservationsService: CreateReservationsService,
    private readonly findAllReservationsService: FindAllReservationsService,
    private readonly findByIdReservationsService: FindByIdReservationsService,
  ) {}

  @Post()
  create(@User('id') id: number, @Body() body: CreateReservationDto) {
    return this.createReservationsService.create(id, body);
  }

  @Get()
  findAll() {
    return this.findAllReservationsService.execute();
  }

  @Get('user')
  findByUser(@User('id') id: number) {
    return this.findByIdReservationsService.execute(id);
  }

  @Get(':id')
  findOne(@ParamId() id: number) {
    return this.findByIdReservationsService.execute(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
  //   return this.reservationsService.update(+id, updateReservationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.reservationsService.remove(+id);
  // }
}
