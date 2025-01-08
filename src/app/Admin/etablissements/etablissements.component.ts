import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-etablissements',
  templateUrl: './etablissements.component.html',
  styleUrls: ['./etablissements.component.css'],
})
export class EtablissementsComponent implements OnInit {
  constructor(private _service: GlobalService) {}

  filterEtablissements(): void {
    this.filteredEtablissements = this.etablissements.filter(
      (e) =>
        e.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        e.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  isLoading: boolean = false;

  loadEtablissemnts(): void {
    this.isLoading = true; // Activer le spinner
    this._service.getEtablissements().subscribe(
      (data) => {
        this.etablissements = data;
        this.filteredEtablissements = this.etablissements;
        this.isLoading = false; // Désactiver le spinner
      },
      (error) => {
        this.isLoading = false; // Désactiver le spinner
        this.deletesMessage =
          'Problème de connexion. Veuillez vérifier votre réseau.';
        // Clear the error message after 3 seconds
        setTimeout(() => {
          this.deletesMessage = ''; // Correct variable name
        }, 3000);
      }
    );
  }

  ngOnInit(): void {
    this.loadEtablissemnts();
  }

  // For adding a new subject
  nom: string = '';
  description: string = '';

  // For editing a subject (Pre-filled values)
  editNom: string = '';
  editDescription: string = '';

  etablissements: any[] = [];
  filteredEtablissements: any[] = [];
  searchTerm: string = '';
  deletesMessage: string = ''; // This will hold the success message
  deleteMessage: string = ''; // This will hold the success message
  successMessage: string = ''; // This will hold the success message
  modifysuccess: string = '';
  hideSuccessMessage(): void {
    this.successMessage = ''; // Clear the message, hiding the alert
    this.deletesMessage = '';
  }
  // Function to handle form submission for adding a new subject
  onSubmit(form: any) {
    if (form.valid) {
      this.isLoading = true;
      const newSubject = {
        nom: this.nom,
        description: this.description,
      };
      console.log('New subject added:', newSubject);
      this._service
        .createEtablissement({
          nom: this.nom,
          description: this.description,
        })
        .subscribe(
          (response) => {
            this.successMessage = 'Etablissement ajouté avec succès!'; // Set success message
            //alert('Etablissement ajouté avec succès!');
            form.reset(); // Réinitialiser le formulaire
            this.ngOnInit();
            this.isLoading = false;
            setTimeout(() => {
              this.successMessage = ''; // Hide the success message after 5 seconds
            }, 2000);
          },
          (error) => {
            this.isLoading = false;

            // Handle error cases
            if (error.status === 500) {
              this.deletesMessage =
                ' Validation échouée. Veuillez vérifier les champs du formulaire.';
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
          }
        );
    }
  }

  id: any;
  onEdit(item: any) {
    this.editNom = item.nom; // Set the current subject's name
    this.editDescription = item.description; // Set the current subject's description
    this.id = item.id;
  }

  onEditSubmit(editForm: any) {
    if (editForm.valid) {
      this.isLoading = true;
      // Update the subject in tableData
      const updatedSubject = {
        nom: this.editNom,
        description: this.editDescription,
      };
      console.log('Subject updated:', updatedSubject);

      this._service
        .updateEtablissement(this.id, {
          nom: this.editNom,
          description: this.editDescription,
        })
        .subscribe(
          (response) => {
            this.modifysuccess = 'Etablissement modifier avec succès!';
            //alert('Etablissement mis à jour avec succès');
            this.isLoading = false;
            this.ngOnInit();
            editForm.reset();
            setTimeout(() => {
              this.modifysuccess = '';
              console.log('After timeout: modifysuccess =', this.modifysuccess);
            }, 2000);
          },
          (error) => {
            this.isLoading = false;

            // Handle error cases
            if (error.status === 500) {
              this.deletesMessage =
                ' Validation échouée. Veuillez vérifier les champs du formulaire.';
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
          }
        );
    }
  }

  confirmDelete(idE: any): void {
    if (idE) {
      this.isLoading = true;

      this._service.deleteEtablissement(idE).subscribe(
        () => {
          this.deleteMessage = 'Etablissement supprimé avec succès!';
          //alert('Etablissement supprimé avec succès');
          this.loadEtablissemnts();
          //this.ngOnInit() // Actualiser la liste
          this.isLoading = false;
          setTimeout(() => {
            this.deleteMessage = ''; // Clear the message after 2 seconds
          }, 2000);
        },
        (error) => {
          this.isLoading = false;
          // Handle error cases
          if (error.status === 500) {
            this.deletesMessage =
              'Impossible de supprimer le passage, il est déjà utilisé ailleurs.';
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
          this.isLoading = false;
        }
      );
    }
  }

  printTable(): void {
    // Get the table element by its ID
    const tableElement = document.getElementById('EtablissementTable');
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

    bodyRows.forEach((row) => {
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
        <title>Liste des établissements</title>
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
          <h1>Liste des établissements</h1>
          <p>Printed on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>

        <!-- Table Content -->
        ${tableClone.outerHTML}

        <!-- Footer -->
        <div class="footer">
          © ${new Date().getFullYear()} Campus | Gestion des langues.
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
    const tableElement = document.getElementById(
      'EtablissementTable'
    ) as HTMLTableElement;

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
    const excelBlob = new Blob([excelData], {
      type: 'application/vnd.ms-excel',
    });
    const excelURL = URL.createObjectURL(excelBlob);

    // Trigger download
    const link = document.createElement('a');
    link.href = excelURL;
    link.download = 'MatiereList.xls'; // Use .xls for compatibility
    link.click();

    // Clean up
    URL.revokeObjectURL(excelURL);
  }
}
