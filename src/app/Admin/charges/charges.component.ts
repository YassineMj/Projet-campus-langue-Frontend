import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.css'],
})
export class ChargesComponent {
  constructor(private _service: GlobalService) {}

  formsData = {
    annee: '',
    description: '',
    montant: null,
    mois: '',
  };

  editData = {
    annee: '',
    description: '',
    montant: null,
    mois: '',
  };
  isLoading: boolean = false;

  loadCharges(): void {
    this.isLoading = true; // Activer le spinner
    this._service.getCharges().subscribe(
      (data) => {
        this.charges = data;
        this.charges = data.map((c) => ({
          ...c,
          dateAuto: this.formatDate(new Date(c.dateAuto)),
          mois: this.getMois(c.mois),
        }));
        this.filteredCharges = this.charges;
        this.isLoading = false; // Désactiver le spinner
      },
      (error) => {
        console.error('Erreur lors du chargement des charges', error);
        this.isLoading = false; // Désactiver le spinner
      }
    );
  }

  ngOnInit(): void {
    this.loadCharges();
  }

  formatDate(date: Date): string {
    const jour = date.getDate().toString().padStart(2, '0');
    const mois = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0
    const annee = date.getFullYear().toString().slice(-4); // Année sur 4 chiffres
    const heures = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${jour}-${mois}-${annee} | ${heures}:${minutes}`;
  }

  getMois(mois: number): string {
    const moisNoms = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];
    return moisNoms[mois - 1] || 'Inconnu';
  }

  filterCharge(): void {
    this.filteredCharges = this.charges.filter(
      (c) =>
        c.id?.toString().includes(this.searchTerm.toLowerCase()) ||
        c.annee?.toString().includes(this.searchTerm.toLowerCase()) ||
        c.montant?.toString().includes(this.searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.mois?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.dateAuto?.toString().includes(this.searchTerm.toLowerCase())
    );
  }

  // Method to hide the success message when the close button is clicked
  hideSuccessMessage(): void {
    this.successMessage = '';
    this.deleteMessage = '';
    this.deletesMessage = '';

    this.modifysuccess = ''; // Clear the message, hiding the alert
  }

  charges: any[] = [];
  filteredCharges: any[] = [];
  searchTerm: string = '';
  deletesMessage: string = '';
  deleteMessage: string = ''; // This will hold the success message
  successMessage: string = ''; // This will hold the success message
  modifysuccess: string = '';

  // Function to handle form submission for adding a new subject
  onSubmit(form: any) {
    if (form.valid) {
      this.isLoading = true;
      const newSubject = {
        montant: this.formsData.montant,
        description: this.formsData.description,
        annee: this.formsData.annee,
        mois: this.formsData.mois,
      };
      console.log('New subject added:', newSubject);
      this._service.addCharge(newSubject).subscribe(
        (response) => {
          this.successMessage = 'Charge ajouté avec succès!'; // Set success message
          form.reset(); // Réinitialiser le formulaire
          this.loadCharges();
          this.isLoading = false;
          setTimeout(() => {
            this.successMessage = ''; // Hide the success message after 5 seconds
          }, 2000);
        },
        (error) => {
          this.isLoading = false; // Désactiver le mode de chargement
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
  openEdit(item: any) {
    this.editData.montant = item.montant; // Set the current subject's name
    this.editData.description = item.description; // Set the current subject's description
    this.editData.annee = item.annee;
    this.editData.mois = item.mois;

    this.id = item.id;
  }

  onEditSubmit(form: any) {
    if (form.valid) {
      this.isLoading = true;

      this._service.updateCharge(this.editData, this.id).subscribe(
        (response) => {
          this.modifysuccess = 'Charge modifier avec succès!'; // Set success message
          form.reset(); // Réinitialiser le formulaire
          this.loadCharges();
          this.isLoading = false;
          setTimeout(() => {
            this.modifysuccess = ''; // Hide the success message after 5 seconds
          }, 2000);
        },
        (error) => {
          this.isLoading = false; // Désactiver le mode de chargement
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

  confirmDelete(id: any): void {
    if (id) {
      this.isLoading = true;

      this._service.deleteCharge(id).subscribe(
        () => {
          this.deleteMessage = 'Charge supprimé avec succès!';
          //alert('Etablissement supprimé avec succès');
          this.ngOnInit();
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
              'Impossible de supprimer ?il est déjà utilisé ailleurs.';
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

  printTable(): void {
    // Get the table element by its ID
    const tableElement = document.getElementById('Charges_Scolaire');
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
          <title>Charges Scolaire</title>
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
            <h1>Charges Scolaire</h1>
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

  downloadAsExcel(): void {
    const tableElement = document.getElementById(
      'Charges_Scolaire'
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
    link.download = 'Charges_Scolaire.xls'; // Use .xls for compatibility
    link.click();

    // Clean up
    URL.revokeObjectURL(excelURL);
  }
}
