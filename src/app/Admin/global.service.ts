import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private baseUrl = 'https://projet-campus-langue-backend-v17.onrender.com/api/profs';

  constructor(private http: HttpClient) {}

  getProfessors(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  addProfessor(professor: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, professor);
  }

  deleteProfessor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  updateProfesseur(id: number, professeur: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, professeur);
  }
}
