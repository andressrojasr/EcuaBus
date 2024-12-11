import { Stop } from "./stop.model";

export interface Frecuency{
    id:string;
    origin:string;
    destiny: string;
    stops: Stop[];
    price:number;
    document:string;
    time: number;
    isBlocked: boolean;
}