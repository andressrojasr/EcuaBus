import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminapiService {
  private apiUrl = 'https://ecua-bus-api.onrender.com/ecuabus'; // Cambiar a la URL de tu servidor en producción

  constructor(private http: HttpClient) {}

  // Crear usuario
  createUser(
    idCoop: string,
    type: string,
    userData: {
      email: string;
      password: string;
      name: string;
      lastName: string;
      phone?: string;
      address?: string;
      card?: string;
      photo?: string;
      isBlocked?: boolean;
      rol?: string;
    }
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idCoop}/${type}`, userData);
  }

  // Actualizar usuario
  updateUser(
    id: string,
    idCoop: string,
    type: string,
    userData: {
      email?: string;
      password?: string;
      name?: string;
      lastName?: string;
      phone?: string;
      address?: string;
      card?: string;
      photo?: string;
    }
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/${idCoop}/${type}`, userData);
  }

  // Eliminar usuario
  deleteUser(id: string, idCoop: string, type: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/${idCoop}/${type}`);
  }
}
