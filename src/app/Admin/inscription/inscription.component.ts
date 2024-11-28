import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent {
  
selectedOption: string | null = null;
 formData = {
  nom: '',
  prenom: '',
  etablissement: '',
  niveaux: '',
  telephone: '',
  nomMere: '',
  telephoneMere: '',
  nomPere: '',
  telephonePere: '',
  commentaire: '',
  cours: '',       // Added cours property
  test: '',        // Added test property
  group: '',       // Added group property
  annee: '',       // Added annee property
  mois: ''         // Added mois property
};

years: string[] = [];

  constructor() {
    this.generateYearRanges();
  }

  generateYearRanges() {
    const startYear = new Date().getFullYear();
    const endYear = startYear + 10; // You can adjust this to how far you want to generate the years.

    for (let year = startYear; year <= endYear; year++) {
      this.years.push(`${year}/${year + 1}`);
    }
  }
  showForm(option: string) {
    this.selectedOption = option;
  }

onSubmit() {
  console.log('Form Data:', this.formData);
  alert('Inscription enregistrée avec succès !');
  this.resetForm();
}


 resetForm() {
  this.formData = {
    nom: '',
    prenom: '',
    etablissement: '',
    niveaux: '',
    telephone: '',
    nomMere: '',
    telephoneMere: '',
    nomPere: '',
    telephonePere: '',
    commentaire: '',
    cours: '',       // Reset cours
    test: '',        // Reset test
    group: '',       // Reset group
    annee: '',       // Reset annee
    mois: ''         // Reset mois
  };
  this.selectedOption = null;
}


   items = [
  { 
    nom: 'hajji', 
    prenom: 'oumaima', 
    etablissement: 'masira', 
    niveaux: '6primaire', 
    telephone: '07000000', 
    nomPere: 'ahmad', 
    telephonePere: '0762030877', 
    nomMere: 'LAYLA', 
    telephoneMere: '0000000', 
    commentaire: 'Sample commentaire', 
    date: new Date().toLocaleDateString() // Auto-generate current date
  }
];


  // Modal data
  nom: string = '';
  prenom: string = '';
  etablissement: string = '';
  niveaux: string = '';
  telephone: string = '';
  nomPere: string = '';
  telephonePere: string = '';
  nomMere: string = '';
  telephoneMere: string = '';
  commentaire: string = '';
  selectedItem: any;


  ngOnInit(): void {
    // Initialize the items array here if needed
    console.log('Items:', this.items);
  }

  // Method to open the Add modal and clear fields
  openAddModal(): void {
    this.nom = '';
    this.prenom = '';
    this.etablissement = '';
    this.niveaux = '';
    this.telephone = '';
    this.nomPere = '';
    this.telephonePere = '';
    this.nomMere = '';
    this.telephoneMere = '';
    this.commentaire = '';
  }

etablissements: string[] = ['Etablissement 1', 'Etablissement 2', 'Etablissement 3'];
Niveaux: string[] = ['Niveau 1', 'Niveau 2', 'Niveau 3'];



  // Method to clear form fields after submission
  clearFormFields(): void {
    this.nom = '';
    this.prenom = '';
    this.etablissement = '';
    this.niveaux = '';
    this.telephone = '';
    this.nomPere = '';
    this.telephonePere = '';
    this.nomMere = '';
    this.telephoneMere = '';
    this.commentaire = '';
  }

  // Method to open the Edit modal and set fields with item data
  openEditModal(item: any): void {
    this.nom = item.nom;
    this.prenom = item.prenom;
    this.etablissement = item.etablissement;
    this.niveaux = item.niveaux;
    this.telephone = item.telephone;
    this.nomPere = item.nomPere;
    this.telephonePere = item.telephonePere;
    this.nomMere = item.nomMere;
    this.telephoneMere = item.telephoneMere;
    this.commentaire = item.commentaire;
  }

  // Method to open the Delete modal (if necessary)
  openDeleteModal(item: any) {
    const modalElement = document.getElementById('deleteConfirmationModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Show the modal
    } else {
      console.error('Modal element not found!');
    }
  }

  // Method to open the Details modal and set the selected item
  openDetailsModal(item: any): void {
    this.selectedItem = item;  // Set the selected item to display in the modal
    const modalElement = document.getElementById('detailsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();  // Show the modal programmatically
    }
  }

}
