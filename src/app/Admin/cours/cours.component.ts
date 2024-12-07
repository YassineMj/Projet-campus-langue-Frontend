import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.css']
})
  
export class CoursComponent implements OnInit {

  constructor(private _service: GlobalService) {}

  isLoading: boolean = false; // Pour afficher le spinner pendant le chargement

  cours: any[] = [];
  filteredCours: any[] = [];
  languages: any[] = [];
  searchTerm: string = '';

  // Champs pour ajout
  nom: string = '';
  description: string = '';
  language: number | null = null;
  tarif: number | null = null;

  // Champs pour modification
  editId: number | null = null;
  editNom: string = '';
  editDescription: string = '';
  editLanguage: number | null = null;
  editTarif: number | null = null;

  ngOnInit(): void {
    this.loadLanguages();
    this.loadCours();
  }

  // Charger les cours
  loadCours(): void {
    this.isLoading = true; // Activer le spinner
    this._service.getCours().subscribe(
      (data) => {
        this.cours = data;
        this.filteredCours = this.cours; // Filtrage initial
        this.isLoading = false; // Désactiver le spinner
      },
      (error) => {
        console.error('Erreur lors du chargement des cours:', error);
        this.isLoading = false; // Désactiver le spinner
      }
    );
  }

  // Charger les langues
  loadLanguages(): void {
    this._service.getLangues().subscribe(
      (data) => {
        this.languages = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des langues:', error);
      }
    );
  }

  // Filtrer les cours
  filterCours(): void {
    this.filteredCours = this.cours.filter((c) =>
      c.libelle?.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      c.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.langue.libelle?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.tarif.toString()?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  
  deleteMessage: string = ''; // This will hold the success message
  successMessage: string = ''; // This will hold the success message
  modifysuccess: string = '';
  hideSuccessMessage(): void {
    this.successMessage = ''; // Clear the message, hiding the alert
  }

  // Ajouter un cours
  onSubmit(form: any): void {
    if (form.valid) {
      this.isLoading = true;
      const newCour = {
        libelle: this.nom,
        description: this.description,
        langueId: this.language,
        tarif: this.tarif
      };

      this._service.createCour(newCour).subscribe(
        (response) => {
          this.successMessage = 'Cours ajouté avec succès!'; // Set success message
          //alert('Cours ajouté avec succès!');
          form.reset();
          this.ngOnInit();
          this.isLoading = false;
          setTimeout(() => {
          this.successMessage = ''; // Hide the success message after 5 seconds
        }, 2000);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du cours:', error);
          alert('Une erreur s\'est produite.');
          this.isLoading = false;
        }
      );
    }
  }

  // Pré-remplir le formulaire pour modification
  onEdit(item: any): void {
    this.editId = item.id;
    this.editNom = item.libelle;
    this.editDescription = item.description;
    this.editLanguage = item.langue?.id;
    this.editTarif = item.tarif;
  }

  // Soumettre les modifications
  onEditSubmit(editForm: any): void {
    if (editForm.valid && this.editId !== null) {
      this.isLoading = true;
      const updatedCour = {
        id: this.editId,
        libelle: this.editNom,
        description: this.editDescription,
        langueId: this.editLanguage,
        tarif: this.editTarif
      };

      this._service.updateCour(this.editId, updatedCour).subscribe(
        (response) => {
          this.modifysuccess = 'Cours modifier avec succès!';
          //alert('Cours mis à jour avec succès!');
          this.ngOnInit();
          editForm.reset();
          this.isLoading = false;
          setTimeout(() => {
          this.modifysuccess = ''; // Hide the success message after 5 seconds
        }, 2000);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du cours:', error);
          alert('Une erreur s\'est produite.');
          this.isLoading = false;
        }
      );
    }
  }

  // Supprimer un cours

  confirmDelete(idC:any): void {
    if (idC !== null) {
      this.isLoading = true;
      this._service.deleteCour(idC).subscribe(
        () => {
          this.deleteMessage = 'Cours supprimé avec succès!';
          //alert('Cours supprimé avec succès!');
          this.loadCours();
          this.isLoading = false;
          setTimeout(() => {
          this.deleteMessage = ''; // Hide the success message after 5 seconds
        }, 2000);
        },
        (error) => {
          console.error('Erreur lors de la suppression du cours:', error);
          alert('Une erreur s\'est produite.');
          this.isLoading = false;
        }
      );
    }
  }



printTable(): void {
  // Get the table element by its ID
  const tableElement = document.getElementById('CoursTable');
  if (!tableElement) {
    console.error('Table element not found!');
    return;
  }

  // Clone the table to modify it for printing
  const tableClone = tableElement.cloneNode(true) as HTMLElement;

  // Remove the "Actions" column (last column) from the cloned table
  const headerRow = tableClone.querySelector('thead tr');
  const bodyRows = tableClone.querySelectorAll('tbody tr');

  if (headerRow) {
    headerRow.removeChild(headerRow.lastElementChild!); // Remove "Actions" header
  }

  bodyRows.forEach(row => {
    row.removeChild(row.lastElementChild!); // Remove "Actions" cell from each row
  });

  // Create a new window for printing
  const printWindow = window.open('', '', 'width=900,height=650');
  if (!printWindow) {
    console.error('Failed to open print window.');
    return;
  }

  // Add styled content to the new window
  printWindow.document.write(`
    <html>
      <head>
        <title>Cours List</title>
        <style>
          /* General body styling */
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
            color: #333;
          }

          /* Header section styling */
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #0275d8;
            padding-bottom: 10px;
            background-color: #eaf4fc;
          }
          .header h1 {
            font-size: 28px;
            margin: 0;
            color: #0275d8;
          }
          .header p {
            font-size: 14px;
            color: #555;
          }

          /* Table styling */
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
            font-size: 14px;
          }
          th {
            background-color: #0275d8;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
          }
          td {
            color: #333;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          tr:nth-child(odd) {
            background-color: #eaf4fc;
          }
          tr:hover {
            background-color: #d9edf7;
          }

          /* Footer section styling */
          .footer {
            text-align: center;
            font-size: 12px;
            color: #0275d8;
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }

          /* Print-specific adjustments */
          @media print {
            body {
              margin: 0;
            }
            .header, .footer {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div class="header">
          <h1>Cours List</h1>
          <p>Printed on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>

        <!-- Table Content -->
        ${tableClone.outerHTML}

        <!-- Footer -->
        <div class="footer">
          © ${new Date().getFullYear()} Campus | Gestion des langues, cours, matières et inscriptions.
        </div>
      </body>
    </html>
  `);

  // Close the document and trigger the print dialog
  printWindow.document.close();
  printWindow.print();
}



// Function to download the list as Excel
downloadAsExcel(): void {
  const tableElement = document.getElementById('CoursTable') as HTMLTableElement;

  if (!tableElement) {
    console.error('Table element not found!');
    return;
  }

  // Generate table HTML
  const tableHTML = tableElement.outerHTML;

  // Create XML data for Excel
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
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>${tableHTML}</body>
    </html>
  `;

  // Create a Blob from the Excel data
  const excelBlob = new Blob([excelData], { type: 'application/vnd.ms-excel' });
  const excelURL = URL.createObjectURL(excelBlob);

  // Trigger download
  const link = document.createElement('a');
  link.href = excelURL;
  link.download = 'CoursTable.xls'; // Use .xls for compatibility
  link.click();

  // Clean up
  URL.revokeObjectURL(excelURL);
}



  
}

