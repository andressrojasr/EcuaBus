import { Stop } from "./stop.model";

export interface Frecuency{
    id:string;
    origin:string;
    destiny: string;
    stops: Stop[];
    price:number;
    document:string;
    timeStart: Date;
    timeEnd: Date;
    time: number;
    isBlocked: boolean;
}