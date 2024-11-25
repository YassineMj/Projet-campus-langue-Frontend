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
          console.log('Matiere ajouté avec succès:', response);
          //alert('Matiere ajouté avec succès!');
          form.reset(); // Réinitialiser le formulaire
          this.ngOnInit()
          this.isLoading = false;
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
            console.log('Matiere mis à jour avec succès :', response);
            //alert('Matiere mis à jour avec succès');
            this.ngOnInit();
            this.isLoading = false;
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

  openDeleteModal(matiereId: number): void {
    this.selectedMatiereId = matiereId;
    console.log(this.selectedMatiereId);
    
  }

  confirmDelete(): void {
    if (this.selectedMatiereId) {
      this.isLoading=true

      this._service.deleteLangue(this.selectedMatiereId).subscribe(
        () => {
          console.log('Matiere supprimé avec succès');
          //alert('Matiere supprimé avec succès');
          this.matieres = this.matieres.filter(p => p.id != this.selectedMatiereId);
          this.filterMatieres(); // Update the list after deletion
          //this.ngOnInit() // Actualiser la liste
          this.isLoading=false
          this.closeModal()
        },
        (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression.');
          this.isLoading=false

        }
      );
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

// Function to print the list
printTable(): void {
  // Get the table element by its ID (adjust the ID as needed)
  const tableElement = document.getElementById('matieresTable');
  if (!tableElement) {
    console.error('Table element not found!');
    return;
  }

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
            border-bottom: 2px solid #0a9dd2;
            padding-bottom: 10px;
          }
          .header h1 {
            font-size: 28px;
            margin: 0;
            color: #0a9dd2;
          }
          .header p {
            font-size: 14px;
            color: #666;
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
            background-color: #0a9dd2;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
          }
          td {
            color: #555;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          tr:hover {
            background-color: #f1f1f1;
          }

          /* Footer section styling */
          .footer {
            text-align: center;
            font-size: 12px;
            color: #aaa;
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
        ${tableElement.outerHTML}

        <!-- Footer -->
        <div class="footer">
          © ${new Date().getFullYear()} Your Organization Name | Powered by [Your Software].
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
  const tableElement = document.getElementById('matieresTable') as HTMLTableElement;

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
  link.download = 'MatiereList.xls'; // Use .xls for compatibility
  link.click();

  // Clean up
  URL.revokeObjectURL(excelURL);
}


}
