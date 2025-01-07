import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-list-de-paiement',
  templateUrl: './list-de-paiement.component.html',
  styleUrls: ['./list-de-paiement.component.css'],
})
export class ListDePaiementComponent implements OnInit {
  searchTerm: string = ''; 
  annee: string = '2024/2025'; 
  matieres: any[] = [];
  months: number[] = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8]; 
  isLoading: boolean = false;


  paiements: any[] = []
  filteredPaiements: any[] = []

    deletesMessage: string = '';


  constructor(private _service: GlobalService) {}

  ngOnInit(): void {
    this.loadScolaireAnnuelle()
    this.loadMatieres();
    this.loadPaiements();   
    this.loadPaiementScolaireAnnuelle(); 
  }

  scolaires:any[]=[]
  loadScolaireAnnuelle(): void {
    this.isLoading = true; // Activer le spinner
    this._service.getScolaires().subscribe(
      (data) => {
        this.scolaires = data;
        this.isLoading = false; // Désactiver le spinner
      },
      (error) => {
         console.log('error');
        
        this.isLoading = false; // Désactiver le spinner même en cas d'erreur
        this.deletesMessage =
          'Problème de connexion. Veuillez vérifier votre réseau.';
        // Clear the error message after 3 seconds
        setTimeout(() => {
          this.deletesMessage = ''; // Correct variable name
        }, 3000);
      }
    );
  }

  loadMatieres(): void {
    this.isLoading=true
    this._service.getLangues().subscribe(
      (data) => {
        this.matieres = data.map((lang) => ({
          id: lang.id,
          libelle: lang.libelle,
          description: lang.description,
          showOtherMonths: true, 
          monthsVisibility: Array(12).fill(true), 
        }));
        this.isLoading=false
      },
      (error) => {
this.isLoading = false; // Désactiver le spinner même en cas d'erreur
        this.deletesMessage =
          'Problème de connexion. Veuillez vérifier votre réseau.';
        // Clear the error message after 3 seconds
        setTimeout(() => {
          this.deletesMessage = ''; // Correct variable name
        }, 3000);      }
    );
    
  }

  loadPaiements(): void {
    this.isLoading=true

    this._service.getPaiements(this.annee).subscribe(
      (data) => {
        this.paiements=data
        this.filteredPaiements=this.paiements
        this.isLoading=false

      },
      (error) => {
        this.isLoading = false; // Désactiver le spinner même en cas d'erreur
        this.deletesMessage =
          'Problème de connexion. Veuillez vérifier votre réseau.';
        // Clear the error message after 3 seconds
        setTimeout(() => {
          this.deletesMessage = ''; // Correct variable name
        }, 3000);

      }
    );
  }

  onDateChange(){
    this.searchTerm=''
    this.loadPaiements()
    this.loadPaiementScolaireAnnuelle();
  }

  filterPaiements(): void {
    const searchTerm = this.searchTerm.trim().toLowerCase(); // Nettoyer et convertir en minuscule
  
    this.filteredPaiements = this.paiements.filter(p => {
      // Combiner nom et prénom dans les deux ordres
      const fullName = `${p.nom?.toLowerCase()} ${p.prenom?.toLowerCase()}`;
      const reverseFullName = `${p.prenom?.toLowerCase()} ${p.nom?.toLowerCase()}`;
  
      // Retourner true si une des conditions correspond
      return fullName.includes(searchTerm) || reverseFullName.includes(searchTerm);
    });
  }


  toggleVisibility(libelle: string): void {
    const matiere = this.matieres.find((m) => m.libelle === libelle);
    if (matiere) {
      matiere.showOtherMonths = !matiere.showOtherMonths;  // Bascule de l'état ouvert/fermé
  
      // Si la matière est fermée, on cache tous les mois (mettre tous à false)
      matiere.monthsVisibility = matiere.showOtherMonths
        ? Array(12).fill(true)  // Si matière ouverte, tous les mois sont visibles
        : Array(12).fill(false); // Si matière fermée, tous les mois sont fermés
  
      // Optionnel : Mise à jour des tarifs et paiements
      this.updateTarifsAndPayments(matiere, matiere.showOtherMonths);
    }
  }
  
  // Méthode pour mettre à jour les tarifs et paiements lorsque la matière est fermée ou ouverte
  updateTarifsAndPayments(matiere: any, isOpened: boolean): void {
    this.filteredPaiements.forEach((etudiant) => {
      if (isOpened) {
        // Réinitialisation ou recalcul des tarifs/paiements lorsque la matière est ouverte
        this.setTarifAndPayment(etudiant, matiere, true);
      } else {
        // Appliquer la logique lorsque la matière est fermée (peut-être mettre à zéro ou un état spécifique)
        this.setTarifAndPayment(etudiant, matiere, false);
      }
    });
  }
  
  // Méthode pour mettre à jour les valeurs de Tarif et Payé en fonction de la matière et de son état
  setTarifAndPayment(etudiant: any, matiere: any, isOpened: boolean): void {
    this.months.forEach((month, i) => {
      if (matiere.monthsVisibility[i]) {
        // Mettre à jour ou réinitialiser le tarif et paiement
        const moisData = etudiant.matieres[matiere.libelle]?.[month];
        if (isOpened) {
          moisData.tarif = moisData.tarif || 0;  // Afficher ou ajuster les tarifs
          moisData.payé = moisData.payé || 0;   // Afficher ou ajuster les paiements
        } else {
          moisData.tarif = 0;  // Réinitialiser le tarif lorsque la matière est fermée
          moisData.payé = 0;   // Réinitialiser le paiement lorsque la matière est fermée
        }
      }
    });
  }
    
  
  getColspan(libelle: string): number {
    const language = this.matieres.find((lang) => lang.libelle === libelle);
    if (language) {
      const visibleMonths = language.monthsVisibility.filter((visible: any) => visible).length; 
      return visibleMonths * 2; 
    }
    return 0; 
  }
  

  getVisibleSubjectsCount(): number {
    return this.matieres.filter(m => m.monthsVisibility.some((visible: any) => visible)).length;
  }

  getColorAndStatus(matiere: string, mois: number, etudiant: any): { color: string, status: string } {
    const matiereData = etudiant.matieres[matiere]?.[mois];
  
    if (!matiereData) {
      return { 
        color: 'white', 
        status: '<span class="badge bg-secondary">Vide</span>', 
      };  
    }
  
    const { montantTotal, tarif } = matiereData;
  
    if (montantTotal === tarif) {
      return { 
        color: 'white', 
        status: `<span class="badge bg-success">Payé ${this.getTotalMontant(matiere,mois,etudiant)}</span>` 
      };  
    } else if (montantTotal < tarif) {
      return { 
        color: 'white', 
        status: `<span class="badge bg-danger">Sous payé ${this.getTotalMontant(matiere,mois,etudiant)}</span>` 

      };  
    } else {
      return { 
        color: 'white', 
        status: `<span class="badge bg-info">Payé en excédent ${this.getTotalMontant(matiere,mois,etudiant)}</span>` 

      };  
    }
  }
  

  getTotalMontant(matiere: string, mois: number, etudiant: any): number {
    const matiereData = etudiant.matieres[matiere]?.[mois];
    return matiereData ? matiereData.montantTotal : 0;
  }

  infoPaiements:any[] = []
  filteredInfoPaiements:any[] = []
  isLoadingDetails=false
  infoPaiement(idEtu:any,idInsc:any){
    this.isLoadingDetails=true

    this._service.getDetailsPaiement(idEtu,idInsc).subscribe(
      (data)=>{
        this.searchTermDetails=''
        this.infoPaiements=data
        this.filteredInfoPaiements=this.infoPaiements
        this.isLoadingDetails=false
      },(error)=>{
        console.error('Erreur lors du chargement des paiements', error);
        this.isLoadingDetails=false
      }
    )

  }

  searchTermDetails:any
  filterDetailsPaiements(){
    this.filteredInfoPaiements = this.infoPaiements.filter(f => 
      f.datePaiement?.toLowerCase().includes(this.searchTermDetails.toLowerCase()) ||
      f.description?.toLowerCase().includes(this.searchTermDetails.toLowerCase()) ||
      f.montant?.toString().includes(this.searchTermDetails.toString()) ||
      f.id?.toString().includes(this.searchTermDetails.toString())
    );
  }

  Paiementscolaires:any[]=[]
  loadPaiementScolaireAnnuelle(): void {
    this.isLoading = true; // Activer le spinner
    this._service.getPaiementScolaires(this.annee).subscribe(
      (data) => {
        this.Paiementscolaires = data;
        this.isLoading = false; // Désactiver le spinner
      },
      (error) => {
        this.isLoading = false; // Désactiver le spinner même en cas d'erreur
        this.deletesMessage =
          'Problème de connexion. Veuillez vérifier votre réseau.';
        // Clear the error message after 3 seconds
        setTimeout(() => {
          this.deletesMessage = ''; // Correct variable name
        }, 3000);
      }
    );
  }

  getPaiementStatus(etudiantId: number, typeId: number): boolean {
    const paiementEtudiant = this.Paiementscolaires.find(
      (p) => p.etudiantId === etudiantId
    );
  
    if (paiementEtudiant && paiementEtudiant.typePaiementStatus[typeId] !== undefined) {
      return paiementEtudiant.typePaiementStatus[typeId];
    }
  
    return false; // Par défaut, si aucune donnée n'est trouvée
  }
  
  
}
