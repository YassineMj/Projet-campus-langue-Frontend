import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private baseUrl = 'https://projet-campus-langue-backend-v17.onrender.com/api';

  constructor(private http: HttpClient) {}

  getProfessors(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl+"/profs");
  }

  addProfessor(professor: any): Observable<any> {
    return this.http.post<any>(this.baseUrl+"/profs", professor);
  }

  deleteProfessor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/profs/${id}`);
  }

  updateProfesseur(id: number, professeur: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/profs/${id}`, professeur);
  }

  /////////////////////////////////////////

  getLangues(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl+"/langues");
  }

  createLangue(data: { libelle: string; description: string }): Observable<any> {
    return this.http.post<any>(this.baseUrl+"/langues", data);
  }

  updateLangue(id: string, data: { libelle: string; description: string }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/langues/${id}`, data);
  }

  deleteLangue(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/langues/${id}`);
  }

  /////////////////////////////////////////
  
  getEtablissements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/etablissements`);
  }

  getEtablissementById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/etablissements/${id}`);
  }

  createEtablissement(data: { nom: string; description: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/etablissements`, data);
  }

  updateEtablissement(id: string, data: { nom: string; description: string }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/etablissements/${id}`, data);
  }

  deleteEtablissement(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/etablissements/${id}`);
  }

  /////////////////////////////////////////

   getNiveaux(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/niveaux`);
  }

  getNiveauById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/niveaux/${id}`);
  }

  createNiveau(data: { nom: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/niveaux`, data);
  }

  updateNiveau(id: string, data: { nom: string }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/niveaux/${id}`, data);
  }

  deleteNiveau(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/niveaux/${id}`);
  }

}
