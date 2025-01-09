import { Component, inject, OnInit } from '@angular/core';
import { Bus } from 'src/app/models/bus.model';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-bus-map',
  templateUrl: './bus-map.page.html',
  styleUrls: ['./bus-map.page.scss'],
})
export class BusMapPage implements OnInit {

  bus: Bus

  seats: any[] = []
  activeSeat = null;
  offsetX = 0;
  offsetY = 0;

  utils = inject(UtilsService)
  firebase = inject(FirebaseService)

  constructor() { }

  ngOnInit() {
    this.bus = history.state.bus
    this.getSeats()
  }


  async getSeats() {
    const user: User = this.utils.getFromLocalStorage('user');
    const path = `cooperatives/${user.uidCooperative}/buses/${this.bus.id}/seats`;

    this.firebase.getCollectionData(path).subscribe({
      next: (res: any[]) => {
        this.seats = res;
      },
      error: (err) => console.error(err),
    });
  }

  getFloors() {
    // Retorna un array de pisos únicos basados en los asientos
    return [...new Set(this.seats.map((seat) => seat.floor))];
  }

  seatsByFloor(floor: number) {
    // Filtra los asientos por el piso proporcionado
    return this.seats.filter((seat) => seat.floor === floor);
  }

  startDragging(seat: any, event: MouseEvent | TouchEvent) {
    this.activeSeat = seat;
    const clientX = (event as MouseEvent).clientX || (event as TouchEvent).touches[0].clientX;
    const clientY = (event as MouseEvent).clientY || (event as TouchEvent).touches[0].clientY;

    this.offsetX = clientX - seat.position.left;
    this.offsetY = clientY - seat.position.top;

    document.addEventListener('mousemove', this.dragSeat.bind(this));
    document.addEventListener('mouseup', this.stopDragging.bind(this));
    document.addEventListener('touchmove', this.dragSeat.bind(this));
    document.addEventListener('touchend', this.stopDragging.bind(this));
  }

  dragSeat(event: MouseEvent | TouchEvent) {
    if (!this.activeSeat) return;

    const clientX = (event as MouseEvent).clientX || (event as TouchEvent).touches[0].clientX;
    const clientY = (event as MouseEvent).clientY || (event as TouchEvent).touches[0].clientY;

    this.activeSeat.position.top = clientY - this.offsetY;
    this.activeSeat.position.left = clientX - this.offsetX;
  }

  stopDragging() {
    this.activeSeat = null;
    document.removeEventListener('mousemove', this.dragSeat.bind(this));
    document.removeEventListener('mouseup', this.stopDragging.bind(this));
    document.removeEventListener('touchmove', this.dragSeat.bind(this));
    document.removeEventListener('touchend', this.stopDragging.bind(this));
  }

  async saveSeatPositions() {
    const user: User = this.utils.getFromLocalStorage('user');
    const seatsPath = `cooperatives/${user.uidCooperative}/buses/${this.bus.id}/seats`;

    // Guardar las nuevas posiciones de los asientos en Firebase
    for (const seat of this.seats) {
      await this.firebase.updateDocument(`${seatsPath}/${seat.id}`, { position: seat.position });
    }
  }
}
