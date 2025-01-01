import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {



  private baseUrl = 'https://projet-campus-langue-backend-v17.onrender.com/api';

  constructor(private http: HttpClient) {}

    // ----- Professors -----
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

    // ----- Langues -----
  getLangues(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl+"/langues");
  }

  getLangueById(idLangue:any): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl+"/langues/"+idLangue);
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

    // ----- Etablissements -----
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

    // ----- Niveaux -----
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

    // ----- Cours -----
  getCours(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cours`);
  }

  createCour(cour: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/cours`, cour);
  }

  updateCour(id: number, cour: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/cours/${id}`, cour);
  }

  deleteCour(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/cours/${id}`);
  }

  // ----- Groupes -----
  getGroupes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/groupes`);
  }

  createGroupe(groupe: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/groupes`, groupe);
  }

  updateGroupe(id: number, groupe: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/groupes/${id}`, groupe);
  }

  deleteGroupe(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/groupes/${id}`);
  }

  // ----- Passages -----
  getPassages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/etudiants/is-passage`);
  }

  createPassage(passage: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/etudiants`, passage);
  }

  updatePassage(id: number, passage: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/etudiants/${id}`, passage);
  }

  deletePassage(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/etudiants/${id}`);
  }


  // ----- Inscriptions -----
  createInscription(inscription: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/inscriptions`, inscription);
  }

    // ----- Etudiants -----
    getEtudiants(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/etudiants`);
    }
    updateEtudiant(id: number, etudiant: any): Observable<any> {
      return this.http.put<any>(`${this.baseUrl}/etudiants/${id}`, etudiant);
    }
    getEtudiantById(id:any){
      return this.http.get<any>(`${this.baseUrl}/etudiants/${id}`);
    }

    // ----- Inscriptions -----
    getInscriptions(mois:string,annee:string): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/inscriptions?mois=${mois}&annee=${annee}`);
    }
    getInscriptionsByIdEtudiant(idEtu:any): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/etudiants/${idEtu}/inscriptions`);
    }
    deleteInscriptions(id:any): Observable<any[]> {
      return this.http.delete<any[]>(`${this.baseUrl}/inscriptions/${id}`);
    }

    // ----- Paiements -----
    addPaiement(paiement:any): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/paiements`,paiement);
    }
    getPaiementsByIdEtudiant(idEtu:any): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/paiements/etudiant/${idEtu}`);
    }
    deletePaiement(id: number): Observable<any> {
      return this.http.delete<any>(`${this.baseUrl}/paiements/${id}`);
    }
    updatePaiement(paiement:any,id:any): Observable<any> {
      return this.http.put<any>(`${this.baseUrl}/paiements/${id}`,paiement);
    }
    getPaiements(anne:any): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/paiements/matieres-tarifs?annee=${anne}`);
    }
    getDetailsPaiement(idEtu:any,idInsc:any): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/paiements/etudiant/${idEtu}/inscription/${idInsc}`);
    }

    // ----- ScolaireAnnuelle -----
    createScolaire(scloaire:any):Observable<any>{
      return this.http.post<any>(`${this.baseUrl}/type-ponctuel`,scloaire)
    }
    updateScolaireAnnuelle(id:any,scloaire:any):Observable<any[]>{
      return this.http.put<any>(`${this.baseUrl}/type-ponctuel/${id}`,scloaire)
    }
    deleteScolaireAnnuelle(id:any):Observable<any>{
      return this.http.delete<any>(`${this.baseUrl}/type-ponctuel/${id}`)
    }
    getScolaires(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/type-ponctuel`);
    }
    // ----- PaiementAnnuelle -----
    addPaiementPonctuel(p:any):Observable<any>{
      return this.http.post<any>(`${this.baseUrl}/paiement-ponctuel`,p)
    }
    getPaiementsAnnuelle(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/paiement-ponctuel`);
    }
    updatePaiementsAnnuelle(paiement:any,id:any):Observable<any>{
      return this.http.put<any>(`${this.baseUrl}/paiement-ponctuel/${id}`,paiement)
    }
    deletePaiementsAnnuelle(id:any):Observable<any>{
      return this.http.delete<any>(`${this.baseUrl}/paiement-ponctuel/${id}`)
    }
    getPaiementScolaires(annee:any): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/paiement-ponctuel/etudiants-paiements-an-annee?annee=${annee}`);
    }
    
    // ----- Charges -----
    addCharge(c:any):Observable<any>{
      return this.http.post<any>(`${this.baseUrl}/charges`,c)
    }
    getCharges(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/charges`);
    }
    updateCharge(charge:any,id:any):Observable<any>{
      return this.http.put<any>(`${this.baseUrl}/charges/${id}`,charge)
    }
    deleteCharge(id:any):Observable<any>{
      return this.http.delete<any>(`${this.baseUrl}/charges/${id}`)
    }

    // ----- Statistiques -----
    getResume(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/statistiques/resume`);
    }
    getGroupesParLangue(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/statistiques/groupes-par-langue`);
    }
    getAnnulle(annee:any): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/statistiques/paiements-ponctuels?annee=${annee}`);
    }
    inscriptionsParAnne(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/statistiques/inscriptions-par-annee`);
    }
    paiementsPonctuelsParAnnee(annee:any): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/statistiques/paiements-ponctuels-par-mois?annee=${annee}`);
    }
    paiementsInscriptionsParAnnee(annee:any): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/statistiques/paiements-inscription-par-mois?annee=${annee}`);
    }
    chargesParAnnee(annee: any): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/statistiques/charges-par-mois?annee=${annee}`);
    }
    netParAnnee(annee: any): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/statistiques/net-par-mois?annee=${annee}`);
    }
    getListEtud(annee: any,mois:any,prof:any): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/statistiques/etudiants?idProf=${prof}&mois=${mois}&annee=${annee}`);
    }
    getNbrEtud(annee: any,mois:any,prof:any): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/statistiques/nombre-etudiants?idProf=${prof}&mois=${mois}&annee=${annee}`);
    }

}
