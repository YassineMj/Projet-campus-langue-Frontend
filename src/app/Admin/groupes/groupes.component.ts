import { Component } from '@angular/core';
import { GlobalService } from '../global.service';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-groupes',
  templateUrl: './groupes.component.html',
  styleUrls: ['./groupes.component.css']
})
export class GroupesComponent {
 
  groupes: any[] = []; // Stocker les groupes
  filteredGroupes: any[] = []; // Groupes filtrés pour la recherche
  searchTerm: string = ''; // Terme de recherche

  // Listes pour les cours et profs
  coursList: any[] = [];
  profsList: any[] = [];

  // Champs pour ajouter un groupe
  nomGroupe: string = '';
  emploidutemp: string = '';
  coursId: number | null = null;
  profId: number | null = null;

  // Champs pour éditer un groupe
  editId: number | null = null;
  editNomGroupe: string = '';
  editEmploidutemp: string = '';
  editCoursId: number | null = null;
  editProfId: number | null = null;

  isLoading: boolean = false;

  constructor(private _service: GlobalService) {}

  ngOnInit(): void {
    this.loadGroupes();
    this.loadCours();
    this.loadProfs();
  }

   // Charger les groupes
   loadGroupes(): void {
    this.isLoading = true;
    this._service.getGroupes().subscribe(
      (data) => {
        this.groupes = data;
        this.filteredGroupes = this.groupes;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des groupes', error);
        this.isLoading = false;
      }
    );
  }

  // Charger les cours
  loadCours(): void {
    this._service.getCours().subscribe(
      (data) => {
        this.coursList = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des cours', error);
      }
    );
  }

  // Charger les profs
  loadProfs(): void {
    this._service.getProfessors().subscribe(
      (data) => {
        this.profsList = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des profs', error);
      }
    );
  }

  deleteMessage: string = ''; // This will hold the success message
  successMessage: string = ''; // This will hold the success message
  modifysuccess: string = '';
  hideSuccessMessage(): void {
    this.successMessage = ''; // Clear the message, hiding the alert
  }

  // Ajouter un nouveau groupe
  onSubmit(form: any): void {
    if (form.valid) {
      this.isLoading = true;
      const newGroupe = {
        nomGroupe: this.nomGroupe,
        emploidutemp: this.emploidutemp,
        coursId: this.coursId,
        profId: this.profId
      };

      this._service.createGroupe(newGroupe).subscribe(
        (response) => {
          
         this.successMessage = 'Groupe ajouté avec succès!'; // Set success message
          //alert('Groupe ajouté avec succès !');
          form.reset();
          this.ngOnInit(); // Recharger la liste des groupes
          this.isLoading = false;
               setTimeout(() => {
          this.successMessage = ''; // Hide the success message after 5 seconds
        }, 3000);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du groupe :', error);
          alert('Une erreur s\'est produite lors de l\'ajout.');
          this.isLoading = false;
        }
      );
    }
  }

  // Pré-remplir les champs pour l'édition
  onEdit(item: any): void {
    this.editId = item.id;
    this.editNomGroupe = item.nomGroupe;
    this.editEmploidutemp = item.emploiDuTemps;
    this.editCoursId = item.cours.id;
    this.editProfId = item.prof.id;
  }

  // Soumettre les modifications d'un groupe
  onEditSubmit(editForm: any): void {
    if (editForm.valid && this.editId !== null) {
      this.isLoading = true;
      const updatedGroupe = {
        nomGroupe: this.editNomGroupe,
        emploidutemp: this.editEmploidutemp,
        coursId: this.editCoursId,
        profId: this.editProfId
      };

      this._service.updateGroupe(this.editId, updatedGroupe).subscribe(
        (response) => {
          
          this.modifysuccess = 'Groupe modifier avec succès!';
          //alert('Groupe mis à jour avec succès !');
          this.ngOnInit(); // Recharger la liste des groupes
          editForm.reset();
          this.isLoading = false;
               setTimeout(() => {
          this.successMessage = ''; // Hide the success message after 5 seconds
        }, 3000);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du groupe :', error);
          alert('Erreur lors de la mise à jour.');
          this.isLoading = false;
        }
      );
    }
  }

  id:any
  openDeleteModal(niveauId: number): void {
    this.id = niveauId;
    console.log(this.id);
  }

  // Supprimer un groupe
  confirmDelete(): void {
    this.isLoading = true;
    this._service.deleteGroupe(this.id).subscribe(
      () => {
        this.deleteMessage = 'Groupe supprimé avec succès!';
        //alert('Groupe supprimé avec succès !');
        this.groupes = this.groupes.filter(g => g.id !== this.id);
        this.ngOnInit()
        this.closeModal();
        this.isLoading = false;
        setTimeout(() => {
          this.successMessage = ''; // Hide the success message after 5 seconds
        }, 3000);
      },
      (error) => {
        console.error('Erreur lors de la suppression du groupe :', error);
        alert('Erreur lors de la suppression.');
        this.closeModal();
        this.isLoading=false
      }
    );
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

  // Filtrer les groupes
  filterGroupes(): void {
    this.filteredGroupes = this.groupes.filter(g =>
      g.nomGroupe?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      g.cours.libelle?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      g.emploiDuTemps?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      g.prof.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      g.prof.prenom?.toLowerCase().includes(this.searchTerm.toLowerCase()) 
    );
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
