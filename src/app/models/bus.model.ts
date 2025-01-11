import { Partner } from "./partners.model";

export interface Bus{
    id:string;
    plate:string;
    chasis: string;
    model: string;
    brand: string;
    seats: number;
    seatsVip: number;
    floors:string;
    idPartner:string;
    partner?: Partner;
}