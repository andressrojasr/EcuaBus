export interface User{
    uid:string;
    name:string;
    lastName: string;
    card: string;
    phone?: string;
    email:string;
    password:string;
    photo: string;
    address?:string;
    uidCooperative: string;
    isBlocked: boolean;
    rol:string;
}