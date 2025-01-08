import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-passager',
  templateUrl: './passager.component.html',
  styleUrls: ['./passager.component.css'],
})
export class PassagerComponent implements OnInit {
  
  constructor(private _service: GlobalService) {}

  passages: any[] = [];
  filteredPassages: any[] = [];
  etablissements: any[] = [];
  niveaux: any[] = [];
  selectedItem: any = {};
  id: number | null = null;
  searchTerm: string = '';
  isLoading: boolean = false;
  datedenaissance: string = '';

  data1 = {
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
    passage: true,
    dateN: '',
  };

  data2 = {
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
    passage: true,
    dateN: '',
  };

  ngOnInit(): void {
    this.loadPassages();
    this.loadEtablissements();
    this.loadNiveaux();
  }

  loadPassages(): void {
    this.isLoading = true;
    this._service.getPassages().subscribe(
      (data) => {
        // Convertir et formater les dates
        this.passages = data.map((passage) => ({
          ...passage,
          dateEnregistrement: this.formatDate(
            new Date(passage.dateEnregistrement)
          ),
        }));

        this.filteredPassages = this.passages;
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

  // Fonction pour formater la date
  formatDate(date: Date): string {
    const jour = date.getDate().toString().padStart(2, '0');
    const mois = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0
    const annee = date.getFullYear().toString().slice(-4); // Année sur 4 chiffres
    const heures = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${jour}-${mois}-${annee} | ${heures}:${minutes}`;
  }

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

  filterPassages(): void {
    const searchTerm = this.searchTerm.trim().toLowerCase(); // Nettoyer et convertir en minuscule

    this.filteredPassages = this.passages.filter((p) => {
      // Combiner nom et prénom dans les deux ordres
      const fullName = `${p.nom.toLowerCase()} ${p.prenom.toLowerCase()}`;
      const reverseFullName = `${p.prenom.toLowerCase()} ${p.nom.toLowerCase()}`;

      // Vérification des autres champs
      const matchOtherFields =
        p.telephone.toLowerCase().includes(searchTerm) ||
        p.etablissement.nom.toLowerCase().includes(searchTerm) ||
        p.niveau.nom.toLowerCase().includes(searchTerm) ||
        (p.nomMere && p.nomMere.toLowerCase().includes(searchTerm)) ||
        (p.nomPere && p.nomPere.toLowerCase().includes(searchTerm)) ||
        (p.dateEnregistrement &&
          p.dateEnregistrement.toLowerCase().includes(searchTerm));

      // Retourner true si une des conditions correspond
      return (
        fullName.includes(searchTerm) ||
        reverseFullName.includes(searchTerm) ||
        matchOtherFields
      );
    });
  }

  openAddModal(): void {
    this.data1 = {
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
      passage: true,
      dateN: '',
    };
    this.id = null;
  }

  openEditModal(item: any): void {
    this.data2.nom = item.nom;
    this.data2.prenom = item.prenom;
    this.data2.etablissement.id = item.etablissement.id;
    this.data2.niveau.id = item.niveau.id;
    this.data2.telephone = item.telephone;
    this.data2.commentaire = item.commentaire;
    this.data2.nomMere = item.nomMere;
    this.data2.telMere = item.telMere;
    this.data2.nomPere = item.nomPere;
    this.data2.telPere = item.telPere;
    this.data2.passage = true;

    this.id = item.id;
  }

  openDetailsModal(item: any): void {
    this.selectedItem = item;
    const modalElement = document.getElementById('detailsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  deleteMessage: string = ''; // This will hold the success message
  successMessage: string = ''; // This will hold the success message
  modifysuccess: string = '';
  errorMessage: string = '';
  deletesMessage: string = '';

  onSubmitMis(form: NgForm): void {
    if (form.valid) {
      this.isLoading = true;
      if (this.id) {
        if ('dateEnregistrement' in this.data2) {
          delete this.data2.dateEnregistrement;
        }

        this._service.updatePassage(this.id, this.data2).subscribe(
          () => {
            this.modifysuccess = 'Passage modifier avec succès!';
            this.loadPassages();

            this.isLoading = false;
            setTimeout(() => {
              this.modifysuccess = ''; // Clear the message after 2 seconds
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
  }

  // Method to hide the success message when the close button is clicked
  hideSuccessMessage(): void {
    this.successMessage = '';
    this.deleteMessage = '';
    this.deletesMessage = '';

    this.modifysuccess = ''; // Clear the message, hiding the alert
  }

  onSubmitAjou(form: NgForm): void {
    if (form.valid) {
      this.isLoading = true;

      this._service.createPassage(this.data1).subscribe(
        () => {
          this.successMessage = 'Passage ajouté avec succès!'; // Message de succès
          this.loadPassages();

          // Réinitialiser les données du formulaire
          this.data1 = {
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
            passage: true,
            dateN: '',
          };

          this.isLoading = false;

          // Cacher le message de succès après 5 secondes
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
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

  confirmDelete(idP: any): void {
    console.log(idP);

    if (idP) {
      this.isLoading = true;
      this._service.deletePassage(idP).subscribe(
        () => {
          this.deleteMessage = 'Passage supprimé avec succès!';
          this.loadPassages();
          this.id = null;
          this.isLoading = false;

          // Clear the success message after 2 seconds
          setTimeout(() => {
            this.deleteMessage = '';
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
    const tableElement = document.getElementById('PassagerTable');
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
        <title>Liste des Passages</title>
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
          <h1>Liste des Passages</h1>
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

  downloadAsExcel(): void {
    const tableElement = document.getElementById(
      'PassagerTable'
    ) as HTMLTableElement;

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

    const blob = new Blob([excelData], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'PassagerList.xls';
    link.click();

    URL.revokeObjectURL(url);
  }
}
