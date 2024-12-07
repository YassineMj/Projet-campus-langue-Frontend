import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-matieres',
  templateUrl: './matieres.component.html',
  styleUrls: ['./matieres.component.css']
})
export class MatieresComponent implements OnInit {

  constructor(private _service: GlobalService) {}
  
   
   matieres:any[]=[]
   filteredMatieres:any[]=[]
   searchTerm: string = '';

   filterMatieres(): void {
    this.filteredMatieres = this.matieres.filter(m => 
      m.libelle?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      m.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
     
    );
  }
  isLoading: boolean = false;

  loadMatiers(): void {
    this.isLoading = true; // Activer le spinner
    this._service.getLangues().subscribe(
      (data) => {
        this.matieres = data;
        this.filteredMatieres=this.matieres;
        this.isLoading = false; // Désactiver le spinner
      },
      (error) => {
        console.error('Erreur lors du chargement des professeurs', error);
        this.isLoading = false; // Désactiver le spinner
      }
    );
  }

  ngOnInit(): void {
    this.loadMatiers();
  }

   // For adding a new subject
  libelle: string = '';
  description: string = '';
  selectedProfessorId: number = 0;

  deleteMessage: string = ''; // This will hold the success message
  successMessage: string = ''; // This will hold the success message
  modifysuccess: string = '';
  hideSuccessMessage(): void {
    this.successMessage = ''; // Clear the message, hiding the alert
  }


  // Handle form submission
  onSubmit(form: any) {
    if (form.valid) {
      this.isLoading = true;
      console.log('Updated values:', {
        libelle: this.libelle,
        description: this.description
      });   
      
      this._service.createLangue({
        libelle: this.libelle,
        description: this.description
      }).subscribe(
        (response) => {
          
          this.successMessage = 'Matiere ajouté avec succès!'; // Set success message
          //alert('Matiere ajouté avec succès!');
          form.reset(); // Réinitialiser le formulaire
          this.ngOnInit()
          this.isLoading = false;
          setTimeout(() => {
          this.successMessage = ''; // Hide the success message after 5 seconds
        }, 2000);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du Matiere:', error);
          alert('Une erreur s\'est produite lors de l\'ajout.');
          this.isLoading = false;
        }
      );

    }
  }
 

  // Variables for editing
  editLibelle : string = '';
  editDescription: string = '';
  id:any

  // Function to handle edit button click
  onEdit(item: any) {
    // Set the current data to edit
    this.editLibelle = item.libelle;
    this.editDescription = item.description;
    this.id =item.id;
  }

  // Function to handle edit form submission
  onEditSubmit(editForm: any) {
    this.isLoading = true;
    if (this.id) {
      this._service
        .updateLangue(this.id, {
          libelle: this.editLibelle,
          description: this.editDescription
        })
        .subscribe(
          (response) => {
            this.modifysuccess = 'Matiere modifier avec succès!';
            //alert('Matiere mis à jour avec succès');
            this.ngOnInit();
            this.isLoading = false;
            setTimeout(() => {
                            this.modifysuccess = ''; // Clear the message after 2 seconds
                          }, 2000);
          },
          (error) => {
            console.error('Erreur lors de la mise à jour du Matiere :', error);
            alert('Erreur lors de la mise à jour');
            this.isLoading = false;
          }
        );
        editForm.reset();
    }
  }


  selectedMatiereId:any



  confirmDelete(idM:any): void {
    if (idM) {
      this.isLoading=true

      this._service.deleteLangue(idM).subscribe(
        () => {
          this.deleteMessage = 'Matiere supprimé avec succès!';
          //alert('Matiere supprimé avec succès');
          this.loadMatiers();
          //this.ngOnInit() // Actualiser la liste
          this.isLoading=false
          setTimeout(() => {
            this.deleteMessage = ''; // Clear the message after 2 seconds
          }, 2000); 
        },
        (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression.');
          this.isLoading=false

        }
      );
    }
  }



  printTable(): void {
    // Get the table element by its ID
    const tableElement = document.getElementById('MatiereTable');
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
          <title>Matiere List</title>
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
            <h1>Matiere List</h1>
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

  // Download as Excel function
  downloadAsExcel(): void {
    console.log('Download button clicked'); // Debugging log
    const tableElement = document.getElementById('MatiereTable') as HTMLTableElement;
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
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; text-align: left; padding: 8px; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>${tableHTML}</body>
      </html>
    `;

    const excelBlob = new Blob([excelData], { type: 'application/vnd.ms-excel' });
    const excelURL = URL.createObjectURL(excelBlob);

    const link = document.createElement('a');
    link.href = excelURL;
    link.download = 'MatiereList.xls';
    link.click();

    URL.revokeObjectURL(excelURL);
  }

}
