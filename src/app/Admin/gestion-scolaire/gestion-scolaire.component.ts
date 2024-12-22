import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-gestion-scolaire',
  templateUrl: './gestion-scolaire.component.html',
  styleUrls: ['./gestion-scolaire.component.css']
})
export class GestionScolaireComponent {

  constructor(private _service: GlobalService) {}

  etudiants: any[] = [];

  
  isLoading: boolean = false;
  filteredEtudiant: any[] = [];

   formsData = {
    etudiantId: null as number | null,
    typePonctuelId: null as number | null,    
    annee: "",
    description: "",
    tarif:null,
    montant : null
  };

  editData = {
    description: "",
    tarif:null,
    montant : null
  };
  idPaiement:any

  ngOnInit(): void {
    this.loadEtudiants();
    this.loadScolaireAnnuelle()
    this.loadPaiementsAnnuelle();
  }

  loadEtudiants(): void {
    this.isLoading = true;
    this._service.getEtudiants().subscribe(
      (data) => {
        // Convertir et formater les dates
        this.etudiants = data
  
        this.filteredEtudiant= this.etudiants;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des passages', error);
        this.isLoading = false;
      }
    );
  }

  searchTermEtud:any
  filterEtudiant(): void {
    this.filteredEtudiant = this.etudiants.filter(p => {
      const searchTerm = this.searchTermEtud.toLowerCase();
  
      // Combinaison des noms pour recherche "nom prénom" et "prénom nom"
      const fullName = `${p.nom.toLowerCase()} ${p.prenom.toLowerCase()}`;
      const reverseFullName = `${p.prenom.toLowerCase()} ${p.nom.toLowerCase()}`;
  
      // Vérifie si les autres champs correspondent
      const matchOtherFields =
      p.id.toString().includes(searchTerm) ||
        p.telephone.toLowerCase().includes(searchTerm) ||
        p.etablissement.nom.toLowerCase().includes(searchTerm) ||
        p.niveau.nom.toLowerCase().includes(searchTerm) 
     
  
      // Combine toutes les conditions
      return fullName.includes(searchTerm) || reverseFullName.includes(searchTerm) || matchOtherFields;
    });
  }

  itemEtud:any={}
  openDetail(item:any){
    this.itemEtud=item
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
        console.error('Erreur lors du chargement des informations', error);
        this.isLoading = false; // Désactiver le spinner
      }
    );
  }
  
  onSubmitAdd(form: any) {
    if (form.valid) {
      this.isLoading=true
      this.formsData.etudiantId=this.itemEtud.id
      this.formsData.typePonctuelId = parseInt(this.formsData.typePonctuelId!.toString(), 10);

      console.log(this.formsData);
      
      this._service.addPaiementPonctuel(this.formsData).subscribe(
        (data) => {
          this.formsData = {
            etudiantId: null,
            typePonctuelId: null,
            annee: "",
            description: "",
            tarif:null,
            montant : null
          };
          this.searchTermEtud=''
          this.loadPaiementsAnnuelle();
          this.isLoading=false

        },
        (error) => {
          console.error('Erreur lors ...', error);
          this.isLoading = false; // Désactiver le spinner
        }
      );

    }
  }

  paiements:any[]=[]
  filteredPaiements:any[]=[]
  loadPaiementsAnnuelle(): void {
    this.isLoading = true;
    this._service.getPaiementsAnnuelle().subscribe(
      (data) => {
        // Convertir et formater les dates
        this.paiements = data
  
        this.filteredPaiements= this.paiements;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des paiements', error);
        this.isLoading = false;
      }
    );
  }

  searchTermPai:any
  filterPaiement(): void {
    this.filteredPaiements = this.paiements.filter(p => {
      const searchTerm = this.searchTermPai.toLowerCase();
  
      // Combinaison des noms pour recherche "nom prénom" et "prénom nom"
      const fullName = `${p.etudiant.nom.toLowerCase()} ${p.etudiant.prenom.toLowerCase()}`;
      const reverseFullName = `${p.etudiant.prenom.toLowerCase()} ${p.etudiant.nom.toLowerCase()}`;
  
      // Vérifie si les autres champs correspondent
      const matchOtherFields =
      p.id.toString().includes(searchTerm) ||
        p.etudiant.telephone.toLowerCase().includes(searchTerm) ||
        p.etudiant.etablissement.nom.toLowerCase().includes(searchTerm) ||
        p.etudiant.niveau.nom.toLowerCase().includes(searchTerm) ||
        p.annee.toLowerCase().includes(searchTerm) ||
        p.dateAuto.toString().includes(searchTerm) ||
        p.montant.toString().includes(searchTerm) ||
        p.annee.toLowerCase().includes(searchTerm) ||
        p.typePonctuel.nom.toLowerCase().includes(searchTerm) 
      // Combine toutes les conditions
      return fullName.includes(searchTerm) || reverseFullName.includes(searchTerm) || matchOtherFields;
    });
  }


  openEditModal(item: any) {
    this.idPaiement=item.id
    this.editData.description=item.description
    this.editData.montant=item.montant
    this.editData.tarif=item.tarif    
    }

  onSubmitEdit(form: any) {
    if (form.valid) {
      this.isLoading=true
      
      this._service.updatePaiementsAnnuelle(this.editData,this.idPaiement).subscribe(
        (data) => {
          this.editData = {
            description: "",
            tarif:null,
            montant : null
          };
          this.searchTermPai=''
          this.loadPaiementsAnnuelle();
          this.isLoading=false

        },
        (error) => {
          console.error('Erreur lors ...', error);
          this.isLoading = false; // Désactiver le spinner
        }
      );

    }
  }

  deletePaiement(item:any){
    this.isLoading=true
      
      this._service.deletePaiementsAnnuelle(item.id).subscribe(
        (data) => {
          this.searchTermPai=''
          this.loadPaiementsAnnuelle();
          this.isLoading=false

        },
        (error) => {
          console.error('Erreur lors ...', error);
          this.isLoading = false; // Désactiver le spinner
        }
      );
  }
 
}
