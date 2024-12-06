import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-etablissements',
  templateUrl: './etablissements.component.html',
  styleUrls: ['./etablissements.component.css']
})
export class EtablissementsComponent implements OnInit {

  constructor(private _service: GlobalService) {}

  filterEtablissements(): void {
    this.filteredEtablissements = this.etablissements.filter(e => 
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
        this.filteredEtablissements=this.etablissements;
        this.isLoading = false; // Désactiver le spinner
      },
      (error) => {
        console.error('Erreur lors du chargement des langues', error);
        this.isLoading = false; // Désactiver le spinner
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

  etablissements:any[]=[]
  filteredEtablissements:any[]=[]
  searchTerm: string = '';

  deleteMessage: string = ''; // This will hold the success message
  successMessage: string = ''; // This will hold the success message
  modifysuccess: string = '';
  hideSuccessMessage(): void {
    this.successMessage = ''; // Clear the message, hiding the alert
  }
  // Function to handle form submission for adding a new subject
  onSubmit(form: any) {
    if (form.valid) {
      this.isLoading = true;
      const newSubject = {
        nom: this.nom,
        description: this.description
      };      
      console.log('New subject added:', newSubject);
      this._service.createEtablissement({
        nom: this.nom,
        description: this.description
      }).subscribe(
        (response) => {
          this.successMessage = 'Etablissement ajouté avec succès!'; // Set success message
          //alert('Etablissement ajouté avec succès!');
          form.reset(); // Réinitialiser le formulaire
          this.ngOnInit()
          this.isLoading = false;
            setTimeout(() => {
          this.successMessage = ''; // Hide the success message after 5 seconds
        }, 2000);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du Etablissement:', error);
          alert('Une erreur s\'est produite lors de l\'ajout.');
          this.isLoading = false;
        }
      );
    }
  }

  id:any
onEdit(item: any) {
  this.editNom = item.nom;  // Set the current subject's name
  this.editDescription = item.description;  // Set the current subject's description
  this.id =item.id;
}
  
 onEditSubmit(editForm: any) {
  if (editForm.valid) {
    this.isLoading = true;
    // Update the subject in tableData
    const updatedSubject = {
      nom: this.editNom,
      description: this.editDescription
    };
    console.log('Subject updated:', updatedSubject);
    
    this._service
        .updateEtablissement(this.id, {
          nom: this.editNom,
          description: this.editDescription
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
            console.error('Erreur lors de la mise à jour du Etablissement :', error);
            alert('Erreur lors de la mise à jour');
            this.isLoading = false;
          }
        );
        
  }
}



confirmDelete(idE:any): void {
  if (idE) {
    this.isLoading=true

    this._service.deleteEtablissement(idE).subscribe(
      () => {
        this.deleteMessage = 'Etablissement supprimé avec succès!';
        //alert('Etablissement supprimé avec succès');
        this.loadEtablissemnts();
        //this.ngOnInit() // Actualiser la liste
        this.isLoading=false
        setTimeout(() => {
            this.deleteMessage = ''; // Clear the message after 2 seconds
          }, 2000); 
      },
      (error) => {
        console.error('Erreur lors de Etablissement:', error);
        alert('Erreur lors de la suppression.');
        this.isLoading=false

      }
    );
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
