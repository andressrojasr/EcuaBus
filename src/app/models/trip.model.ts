export interface Trip{
    id:string;
    idbus: string;
    idcobrador: string;
    idconductor: string;
    idfrec: string;
    seats: number;
    seatsVip: number;
    price: number;
    priceVip: number;
    status: string;
    date: Date;
}