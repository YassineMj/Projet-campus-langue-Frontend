import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { GlobalService } from '../global.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-etudiant',
  templateUrl: './detail-etudiant.component.html',
  styleUrls: ['./detail-etudiant.component.css'],
})
export class DetailEtudiantComponent {
  @Input() idEtu!: any;

  isLoading: boolean = false;

  deleteMessage: string = ''; // This will hold the success message

  constructor(
    private activeRoute: ActivatedRoute,
    private _service: GlobalService
  ) {
    this.activeRoute.params.subscribe((params) => {
      this.idEtu = params['idEtu'];
    });
  }

  etudiant: any;
  inscriptions: any;
  inscriptions2: any[] = [];
  deletesMessage: string = '';
  filteredInscriptions: any[] = [];
  searchTerm: string = '';

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

  formatEdt(edt: string): string {
    return edt.replace(/\n/g, ' | ');
  }

  ngOnInit(): void {
    // this.loadCours();
    // this.loadProfs();
    // this.loadGroupes();
    this.loadDetails();
  }

  loadDetails() {
    this.isLoading = true;

    this._service.getEtudiantById(this.idEtu).subscribe(
      (data) => {
        this.etudiant = data;

        this._service.getInscriptionsByIdEtudiant(this.idEtu).subscribe(
          (data) => {
            this.inscriptions = data;
            this.inscriptions2 = this.inscriptions.inscriptions;

            this.inscriptions2 = this.inscriptions2.map((i) => ({
              ...i,
              mois: this.getMois(i.mois),
            }));

            this.filteredInscriptions = this.inscriptions2;
          },
          (error) => {
            alert('Erreur lors de chargement des inscriptions.');
          }
        );
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

  filterInscription(): void {
    this.filteredInscriptions = this.inscriptions2.filter(
      (i) =>
        i.annee.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        i.dateInscription.toString().includes(this.searchTerm.toLowerCase()) ||
        i.mois.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        i.prof.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        i.langue.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        i.groupe.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        i.cours.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Method to hide the success message when the close button is clicked
  hideSuccessMessage(): void {
    this.deleteMessage = '';
    this.deletesMessage = '';
  }

  confirmDelete(idInsc: any): void {
    this.isLoading = true;

    this._service.deleteInscriptions(idInsc).subscribe(
      () => {
        this.loadDetails();
      },
      (error) => {
        this.isLoading = false;
        // Handle error cases
        if (error.status == 500) {
          this.deletesMessage =
            "Impossible de supprimer l'inscription, il est déjà payé";
          // Clear the error message after 3 seconds
          setTimeout(() => {
            this.deletesMessage = ''; // Correct variable name
          }, 3000);
          this.ngOnInit();
          return;
        }

        if (error.status == 200) {
          this.deleteMessage = 'Linscription supprimé avec succès!';
          //alert('Cours supprimé avec succès!');
          this.isLoading = false;
          setTimeout(() => {
            this.deleteMessage = ''; // Hide the success message after 5 seconds
          }, 2000);
          this.ngOnInit();
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

  data = {
    etudiantId: null,
    coursId: null,
    groupeId: null,
    profId: null,
    mois: null,
    annee: null,
    emploidutemp: null,
    test: null,
  };

  onGroupChange() {
    this.groupes.forEach((element) => {
      if (element.id == this.data.groupeId) {
        this.data.emploidutemp = element.emploiDuTemps;
        return;
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      // Handle form submission logic
      console.log('Form data:', this.data);
    } else {
      console.log('Form is invalid');
    }
  }

  // idInscription:any

  cours: any[] = [];
  profs: any[] = [];
  groupes: any[] = [];

  // loadCours(): void {
  //   this._service.getCours().subscribe(
  //     (data) => {
  //       this.cours = data;
  //     },
  //     (error) => {
  //       console.error('Erreur lors du chargement des cours', error);
  //     }
  //   );
  // }

  // loadProfs(): void {
  //   this._service.getProfessors().subscribe(
  //     (data) => {
  //       this.profs = data;
  //     },
  //     (error) => {
  //       console.error('Erreur lors du chargement des profs', error);
  //     }
  //   );
  // }

  // loadGroupes(): void {
  //   this._service.getGroupes().subscribe(
  //     (data) => {
  //       this.groupes = data;
  //     },
  //     (error) => {
  //       console.error('Erreur lors du chargement des groupes', error);
  //     }
  //   );
  // }

  printTable(): void {
    // Get the table element by its ID
    const tableElement = document.getElementById('DetailDetudiant');
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
        <title> Liste de cours</title>
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
          <h1> Liste de cours</h1>
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
      'DetailDetudiant'
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
    link.download = 'etudianttable.xls';
    link.click();

    URL.revokeObjectURL(url);
  }
}
