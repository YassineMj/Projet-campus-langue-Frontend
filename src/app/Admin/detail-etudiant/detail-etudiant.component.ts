import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-detail-etudiant',
  templateUrl: './detail-etudiant.component.html',
  styleUrls: ['./detail-etudiant.component.css']
})
export class DetailEtudiantComponent {

  constructor(private _service: GlobalService) { }
  data = {
    matieres: '',
    mois: '',
    groupe: '',
    annee: '',
    professeur: '',
    edt: '',
    test: ''
  };

  onSubmit(form: NgForm) {
    if (form.valid) {
      // Handle form submission logic
      console.log('Form data:', this.data);
    } else {
      console.log('Form is invalid');
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('deleteConfirmationModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
  
      // Supprimer manuellement les classes ajoutées par Bootstrap
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove(); // Supprime le backdrop (fond gris)
      }
    }
  }
  
  printTable(): void {
  const tableElement = document.getElementById('etudianttable');
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
        <h1>Etudiant List</h1>
        <p>Printed on ${new Date().toLocaleString()}</p>
        ${tableElement.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

  downloadAsExcel(): void {
  const tableElement = document.getElementById('etudianttable') as HTMLTableElement;

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
  link.download = 'etudianttable.xls';
  link.click();

  URL.revokeObjectURL(url);
}

}
