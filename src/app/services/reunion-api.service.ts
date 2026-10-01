import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reunion, CreateReunionRequest, PagedResultDto } from '../models/reunion.model';

@Injectable({
  providedIn: 'root'
})
export class ReunionApiService {
  private readonly apiUrl = 'https://localhost:44371/api/app/reunion';

  constructor(private http: HttpClient) {}

  getReuniones(skipCount: number = 0, maxResultCount: number = 100): Observable<PagedResultDto<Reunion>> {
    const params = new HttpParams()
      .set('skipCount', skipCount.toString())
      .set('maxResultCount', maxResultCount.toString());

    return this.http.get<PagedResultDto<Reunion>>(this.apiUrl, { params });
  }

  getReunion(id: string): Observable<Reunion> {
    return this.http.get<Reunion>(`${this.apiUrl}/${id}`);
  }

  createReunion(reunion: CreateReunionRequest): Observable<Reunion> {
    return this.http.post<Reunion>(this.apiUrl, reunion);
  }

  updateReunion(id: string, reunion: CreateReunionRequest): Observable<Reunion> {
    return this.http.put<Reunion>(`${this.apiUrl}/${id}`, reunion);
  }

  deleteReunion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  finishReunion(id: string): Observable<Reunion> {
    return this.http.post<Reunion>(`${this.apiUrl}/${id}/finish`, {});
  }

  startReunion(id: string): Observable<Reunion> {
    return this.http.post<Reunion>(`${this.apiUrl}/${id}/start`, {});
  }

  getPerfil(): Observable<any> {
    return this.http.get<any>('https://localhost:44371/api/app/perfil');
  }

  updateFotoPerfil(foto: string): Observable<any> {
    return this.http.post<any>('https://localhost:44371/api/app/perfil/foto', { fotoPerfil: foto });
  }
}
