import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { GlobalService } from '../global.service';


@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {

  constructor(private _service: GlobalService) {}


  ngOnInit(): void {
    this.loadCours()
    this.loadEtablissements();
    this.loadGroupes();
    this.loadNiveaux();
    this.loadProfs();
    this.loadEtudiants();
  }

  

  isLoading: boolean = false;

  etablissements: any[] = [];
  niveaux: any[] = [];
  cours:any[]=[];
  profs:any[]=[];
  groupes:any[]=[];

  etudiants: any[] = [];
  filteredEtudiant: any[] = [];
  searchTerm: string = '';
  selectedItem: any = {};
  successMessage: string = ''; // This will hold the success message
  hideSuccessMessage(): void {
    this.successMessage = ''; // Clear the message, hiding the alert
  }


  loadEtudiants(): void {
    this.isLoading = true;
    this._service.getEtudiants().subscribe(
      (data) => {
        // Convertir et formater les dates
        this.etudiants = data.map(e => ({
          ...e,
          dateEnregistrement: this.formatDate(new Date(e.dateEnregistrement))
        }));
  
        this.filteredEtudiant= this.etudiants;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des passages', error);
        this.isLoading = false;
      }
    );
  }

  filterEtudiant(): void {
    this.filteredEtudiant = this.etudiants.filter(p => 
      p.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.telephone.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.etablissement.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.niveau.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.nomMere.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.nomPere.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.dateEnregistrement.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      
  }

  formatDate(date: Date): string {
    const jour = date.getDate().toString().padStart(2, '0');
    const mois = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0
    const annee = date.getFullYear().toString().slice(-4); // Année sur 4 chiffres
    const heures = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${jour}-${mois}-${annee} | ${heures}:${minutes}`;
  }

  openDetailsModal(item: any): void {
    this.selectedItem = item;
    const modalElement = document.getElementById('detailsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  selectedOption: string | null = null;
  formDataEtu = {
    nom: "",
    prenom: "",
    etablissement: { id: null },
    niveau: { id: null },
    telephone: "",
    commentaire: "",
    nomMere: "",
    telMere: "",
    nomPere: "",
    telPere: "",
    passage: false
  };

  formDataIns={
  etudiantId: null,
  coursId: null,
  groupeId: null,
  profId:null ,
  mois: null,
  annee: null,
	emploidutemp: null,
	test:null
  }


  loadEtablissements(): void {
    this.isLoading = true;
    this._service.getEtablissements().subscribe(
      (data) => {
        this.etablissements = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des établissements', error);
        this.isLoading = false;
      }
    );
  }

  loadNiveaux(): void {
    this.isLoading = true;
    this._service.getNiveaux().subscribe(
      (data) => {
        this.niveaux = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des niveaux', error);
        this.isLoading = false;
      }
    );
  }

  loadCours(): void {
    this._service.getCours().subscribe(
      (data) => {
        this.cours = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des cours', error);
      }
    );
  }

  loadProfs(): void {
    this._service.getProfessors().subscribe(
      (data) => {
        this.profs = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des profs', error);
      }
    );
  }

  loadGroupes(): void {
    this._service.getGroupes().subscribe(
      (data) => {
        this.groupes = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des groupes', error);
      }
    );
  }

  onGroupChange(){
    this.groupes.forEach(element => {

      if(element.id==this.formDataIns.groupeId){
        this.formDataIns.emploidutemp=element.emploiDuTemps
        return;
      }
    });
  }
 

  showForm(option: string) {
    this.selectedOption = option;
  }

  onSubmit(): void {
    if (this.formDataEtu && this.formDataIns) {
      this.isLoading = true; // Indicateur de chargement
      this._service.createPassage(this.formDataEtu).subscribe({
        next: (etuData) => {
          this.formDataIns.etudiantId = etuData.id;
          console.log('ID de l’étudiant créé:', this.formDataIns.etudiantId);
          
          this._service.createInscription(this.formDataIns).subscribe({
            next: (inscriptionData) => {
              this.successMessage = 'Linscription effectuée avec succès!'; // Set success message
              this.formDataEtu = {
                nom: "",
                prenom: "",
                etablissement: { id: null },
                niveau: { id: null },
                telephone: "",
                commentaire: "",
                nomMere: "",
                telMere: "",
                nomPere: "",
                telPere: "",
                passage: false
              };
            
              this.formDataIns={
              etudiantId: null,
              coursId: null,
              groupeId: null,
              profId:null ,
              mois: null,
              annee: null,
              emploidutemp: null,
              test:null
              }
                this.loadEtudiants();
                setTimeout(() => {
          this.successMessage = ''; // Hide the success message after 5 seconds
        }, 2000);
            },
            error: (error) => {
              console.error('Erreur lors de la création de l’inscription:', error);
              alert('Une erreur est survenue lors de la création de l’inscription.');
            },
            complete: () => this.isLoading = false
          });
        },
        error: (error) => {
          console.error('Erreur lors de la création du passage:', error);
          alert('Une erreur est survenue lors de la création du passage.');
          this.isLoading = false;
          
        }
      });
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }
  
  onSubmitInsc(): void {
    if (this.formDataIns) {
      this.isLoading = true; 
          this.formDataIns.etudiantId=this.selectedItem.id
          this._service.createInscription(this.formDataIns).subscribe({
            next: (inscriptionData) => {
              console.log('Inscription créée:', inscriptionData);
              this.successMessage = 'Linscription effectuée avec succès!'; // Set success message
              this.isLoading = false
              this.loadEtudiants();
              setTimeout(() => {
          this.successMessage = ''; // Hide the success message after 5 seconds
        }, 2000);
            },
            error: (error) => {
              console.error('Erreur lors de la création de l’inscription:', error);
              alert('Une erreur est survenue lors de la création de l’inscription.');
              this.isLoading = false
            },
          });    
        
      }
    else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }


    isPassager: boolean = true; // Example value
  isEtudiant: boolean = false; // Example value

}
