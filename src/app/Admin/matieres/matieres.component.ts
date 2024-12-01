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
        }, 3000);
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

  openDeleteModal(matiereId: number): void {
    this.selectedMatiereId = matiereId;
    console.log(this.selectedMatiereId);
    
  }

  confirmDelete(): void {
    if (this.selectedMatiereId) {
      this.isLoading=true

      this._service.deleteLangue(this.selectedMatiereId).subscribe(
        () => {
          this.deleteMessage = 'Matiere supprimé avec succès!';
          //alert('Matiere supprimé avec succès');
          this.matieres = this.matieres.filter(p => p.id != this.selectedMatiereId);
          this.filterMatieres(); // Update the list after deletion
          //this.ngOnInit() // Actualiser la liste
          this.isLoading=false
          this.closeModal()
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



// Print function
  printTable(): void {
    console.log('Print button clicked'); // Debugging log
    const tableElement = document.getElementById('matieresTable');
    if (!tableElement) {
      console.error('Table element not found!');
      return;
    }

    const printWindow = window.open('', '', 'width=900,height=650');
    if (!printWindow) {
      console.error('Failed to open print window.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Matiere List</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Matiere List</h1>
          <p>Printed on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          ${tableElement.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  }

  // Download as Excel function
  downloadAsExcel(): void {
    console.log('Download button clicked'); // Debugging log
    const tableElement = document.getElementById('matieresTable') as HTMLTableElement;
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
