import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'],
})
export class InscriptionComponent implements OnInit {
  constructor(private _service: GlobalService) {}

  ngOnInit(): void {
    this.loadCours();
    this.loadEtablissements();
    this.loadGroupes();
    this.loadNiveaux();
    this.loadProfs();
    this.loadEtudiants();
  }

  isLoading: boolean = false;

  etablissements: any[] = [];
  niveaux: any[] = [];
  cours: any[] = [];
  profs: any[] = [];
  groupes: any[] = [];
  errorMessage: string = '';
  deletesMessage: string = '';
  etudiants: any[] = [];
  filteredEtudiant: any[] = [];
  searchTerm: string = '';
  selectedItem: any = {};
  successMessage: string = ''; // This will hold the success message
  hideSuccessMessage(): void {
    this.successMessage = ''; // Clear the message, hiding the alert
    this.deletesMessage = '';
  }

  loadEtudiants(): void {
    this.isLoading = true;
    this._service.getEtudiants().subscribe(
      (data) => {
        // Convertir et formater les dates
        this.etudiants = data.map((e) => ({
          ...e,
          dateEnregistrement: this.formatDate(new Date(e.dateEnregistrement)),
        }));

        this.filteredEtudiant = this.etudiants;
        this.isLoading = false;
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

  filterEtudiant(): void {
    this.filteredEtudiant = this.etudiants.filter((p) => {
      const searchTerm = this.searchTerm.toLowerCase();

      // Combinaison des noms pour recherche "nom prénom" et "prénom nom"
      const fullName = `${p.nom.toLowerCase()} ${p.prenom.toLowerCase()}`;
      const reverseFullName = `${p.prenom.toLowerCase()} ${p.nom.toLowerCase()}`;

      // Vérifie si les autres champs correspondent
      const matchOtherFields =
        p.telephone.toLowerCase().includes(searchTerm) ||
        p.etablissement.nom.toLowerCase().includes(searchTerm) ||
        p.niveau.nom.toLowerCase().includes(searchTerm) ||
        (p.nomMere && p.nomMere.toLowerCase().includes(searchTerm)) ||
        (p.nomPere && p.nomPere.toLowerCase().includes(searchTerm)) ||
        (p.dateEnregistrement &&
          p.dateEnregistrement.toLowerCase().includes(searchTerm));

      // Combine toutes les conditions
      return (
        fullName.includes(searchTerm) ||
        reverseFullName.includes(searchTerm) ||
        matchOtherFields
      );
    });
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
    nom: '',
    prenom: '',
    etablissement: { id: null },
    niveau: { id: null },
    telephone: '',
    commentaire: '',
    nomMere: '',
    telMere: '',
    nomPere: '',
    telPere: '',
    passage: false,
    dateN: '',
  };

  formDataIns = {
    etudiantId: null,
    coursId: null,
    groupeId: null,
    profId: null,
    mois: null,
    annee: null,
    emploidutemp: null,
    test: null,
    tarif: null, // Add the tarif property
  };

  loadEtablissements(): void {
    this.isLoading = true;
    this._service.getEtablissements().subscribe(
      (data) => {
        this.etablissements = data;
        this.isLoading = false;
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

  loadNiveaux(): void {
    this.isLoading = true;
    this._service.getNiveaux().subscribe(
      (data) => {
        this.niveaux = data;
        this.isLoading = false;
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

  loadCours(): void {
    this._service.getCours().subscribe(
      (data) => {
        this.cours = data;
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

  loadProfs(): void {
    this._service.getProfessors().subscribe(
      (data) => {
        this.profs = data;
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

  loadGroupes(): void {
    this._service.getGroupes().subscribe(
      (data) => {
        this.groupes = data;
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

  onGroupChange() {
    this.groupes.forEach((element) => {
      if (element.id == this.formDataIns.groupeId) {
        this.formDataIns.emploidutemp = element.emploiDuTemps;
        return;
      }
    });
  }

  onCoursChange() {
    this.cours.forEach((element) => {
      if (element.id == this.formDataIns.coursId) {
        this.formDataIns.tarif = element.tarif;
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
                nom: '',
                prenom: '',
                etablissement: { id: null },
                niveau: { id: null },
                telephone: '',
                commentaire: '',
                nomMere: '',
                dateN: '',
                telMere: '',
                nomPere: '',
                telPere: '',
                passage: false,
              };

              this.formDataIns = {
                etudiantId: null,
                coursId: null,
                groupeId: null,
                profId: null,
                mois: null,
                annee: null,
                emploidutemp: null,
                test: null,
                tarif: null,
              };
              this.loadEtudiants();
              setTimeout(() => {
                this.successMessage = ''; // Hide the success message after 5 seconds
              }, 2000);
            },
            error: (error) => {
              this.deletesMessage =
                'Problème de connexion. Veuillez vérifier votre réseau.';
              // Clear the error message after 3 seconds
              setTimeout(() => {
                this.deletesMessage = ''; // Correct variable name
              }, 3000);
            },
            complete: () => (this.isLoading = false),
          });
        },
        error: (error) => {
          this.isLoading = false; // Désactiver le mode de chargement
          // Handle error cases
          if (error.status === 500) {
            this.deletesMessage =
              'Validation échouée. Veuillez vérifier les champs du formulaire ou cette inscription existe peut-être déjà.';
            // Clear the error message after 3 seconds
            setTimeout(() => {
              this.deletesMessage = ''; // Correct variable name
            }, 3000);
            return;
          } else {
            this.deletesMessage =
              'Problème de connexion. Veuillez vérifier votre réseau.';
            // Clear the error message after 3 seconds
            setTimeout(() => {
              this.deletesMessage = ''; // Correct variable name
            }, 3000);
            return;
          }
        },
      });
    }
  }

  onSubmitInsc(): void {
    if (this.formDataIns) {
      this.isLoading = true;
      this.formDataIns.etudiantId = this.selectedItem.id;
      this._service.createInscription(this.formDataIns).subscribe({
        next: (inscriptionData) => {
          console.log('Inscription créée:', inscriptionData);
          this.successMessage = 'Linscription effectuée avec succès!'; // Set success message
          this.isLoading = false;
          this.loadEtudiants();
          setTimeout(() => {
            this.successMessage = ''; // Hide the success message after 5 seconds
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false; // Désactiver le mode de chargement
          // Handle error cases
          if (error.status === 500) {
            this.deletesMessage =
              'Validation échouée. Veuillez vérifier les champs du formulaire ou cette inscription existe peut-être déjà.';
            // Clear the error message after 3 seconds
            setTimeout(() => {
              this.deletesMessage = ''; // Correct variable name
            }, 3000);
            return;
          } else {
            this.deletesMessage =
              'Problème de connexion. Veuillez vérifier votre réseau.';
            // Clear the error message after 3 seconds
            setTimeout(() => {
              this.deletesMessage = ''; // Correct variable name
            }, 3000);
            return;
          }
        },
      });
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }

  isPassager: boolean = true; // Example value
  isEtudiant: boolean = false; // Example value
}
