import { Partner } from "./partners.model";

export interface Bus{
    id:string;
    plate:string;
    chasis: string;
    seats: number;
    floors:string;
    idPartner:string;
    partner?: Partner;
}