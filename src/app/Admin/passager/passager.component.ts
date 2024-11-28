import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-passager',
  templateUrl: './passager.component.html',
  styleUrls: ['./passager.component.css']
})
export class PassagerComponent {
  constructor() {}

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

 onSubmit(form: NgForm) {
  if (form.valid) {
    console.log('Formulaire soumis avec succès:', form.value);

    const editedItem = this.items.find(item => item.nom === this.nom && item.prenom === this.prenom);

    if (editedItem) {
      // Update existing item
      editedItem.nom = this.nom;
      editedItem.prenom = this.prenom;
      editedItem.etablissement = this.etablissement;
      editedItem.niveaux = this.niveaux;
      editedItem.telephone = this.telephone;
      editedItem.nomPere = this.nomPere;
      editedItem.telephonePere = this.telephonePere;
      editedItem.nomMere = this.nomMere;
      editedItem.telephoneMere = this.telephoneMere;
      editedItem.commentaire = this.commentaire;
    } else {
      // Add new item with auto-generated date
      this.items.push({
        nom: this.nom,
        prenom: this.prenom,
        etablissement: this.etablissement,
        niveaux: this.niveaux,
        telephone: this.telephone,
        nomPere: this.nomPere,
        telephonePere: this.telephonePere,
        nomMere: this.nomMere,
        telephoneMere: this.telephoneMere,
        commentaire: this.commentaire,
        date: new Date().toLocaleDateString() // Auto-generate current date
      });
    }

    // Clear the form after submission
    form.resetForm();
  } else {
    console.log('Formulaire invalide');
  }
}

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

printTable(): void {
  const tableElement = document.getElementById('passagertable');
  if (!tableElement) {
    console.error('Table element not found!');
    return;
  }

  const printWindow = window.open('', '', 'width=900,height=650');
  if (!printWindow) {
    console.error('Failed to open print window.');
    return;
  }

  // Add content and styles to the new window
  printWindow.document.write(`
    <html>
      <head>
        <title>Matiere List</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
            color: #333;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <h1>Matiere List</h1>
        <p>Printed on ${new Date().toLocaleString()}</p>
        ${tableElement.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

  downloadAsExcel(): void {
  const tableElement = document.getElementById('passagertable') as HTMLTableElement;

  if (!tableElement) {
    console.error('Table element not found!');
    return;
  }

  const tableHTML = tableElement.outerHTML;

  const excelData = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #ddd;
            text-align: left;
            padding: 8px;
          }
          th {
            background-color: #f4f4f4;
          }
        </style>
      </head>
      <body>${tableHTML}</body>
    </html>
  `;

  const blob = new Blob([excelData], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'PassagerList.xls';
  link.click();

  URL.revokeObjectURL(url);
}

}