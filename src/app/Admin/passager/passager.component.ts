import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-passager',
  templateUrl: './passager.component.html',
  styleUrls: ['./passager.component.css']
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

  data = {
    nom: "",
    prenom: "",
    etablissement: { id: null },
    niveau: { id: null },
    telephone: "",
    commentaire: "",
    nomMere: "",
    telMere: "",
    nomPere: "",
    telPere: "",
    passage: true
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
        this.passages = data.map(passage => ({
          ...passage,
          dateEnregistrement: this.formatDate(new Date(passage.dateEnregistrement))
        }));
  
        this.filteredPassages = this.passages;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des passages', error);
        this.isLoading = false;
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
        console.error('Erreur lors du chargement des établissements', error);
        this.isLoading = false;
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
        console.error('Erreur lors du chargement des niveaux', error);
        this.isLoading = false;
      }
    );
  }

  filterPassages(): void {
    this.filteredPassages = this.passages.filter(p => 
      p.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.telephone.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.etablissement.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.niveau.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.nomMere.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.nomPere.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.dateEnregistrement.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      
  }

  openAddModal(): void {
    this.data = {
      nom: "",
      prenom: "",
      etablissement: { id: null },
      niveau: { id: null },
      telephone: "",
      commentaire: "",
      nomMere: "",
      telMere: "",
      nomPere: "",
      telPere: "",
      passage: true
    };
    this.id = null;
  }

  openEditModal(item: any): void {
    this.data = { ...item };
    this.id = item.id;
  }

  openDeleteModal(id: number): void {
    this.id = id;
  }

  openDetailsModal(item: any): void {
    this.selectedItem = item;
    const modalElement = document.getElementById('detailsModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.isLoading = true;
      if (this.id) {
        if ('dateEnregistrement' in this.data) {
          delete this.data.dateEnregistrement;
        }        
        
        this._service.updatePassage(this.id, this.data).subscribe(
          () => {
            //alert('Passage mis à jour avec succès!');
            this.loadPassages();
            form.resetForm();
            this.isLoading = false;
          },
          (error) => {
            alert('Erreur lors de la mise à jour du passage.');
            this.isLoading = false;
          }
        );
      } else {
        this._service.createPassage(this.data).subscribe(
          () => {
            //alert('Passage ajouté avec succès!');
            this.loadPassages();
            form.resetForm();
            this.isLoading = false;
          },
          (error) => {
            alert('Erreur lors de l\'ajout du passage.');
            this.isLoading = false;
          }
        );
      }
    }
  }

  confirmDelete(): void {
    if (this.id) {
      this.isLoading = true;
      this._service.deletePassage(this.id).subscribe(
        () => {
          //alert('Passage supprimé avec succès');
          this.passages = this.passages.filter(p => p.id !== this.id);
          this.filterPassages();
          this.id = null;
          this.isLoading = false;
          this.closeModal()
        },
        (error) => {
          alert('Erreur lors de la suppression du passage.');
          this.isLoading = false;
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

  // closeDetailsModal(): void {
  //   const modalElement = document.getElementById('detailsModal');
    
  //   if (modalElement) {
  //     try {
  //       // Récupération de l'instance existante ou création d'une nouvelle
  //       let modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        
  //       // Fermeture correcte
  //       modalInstance.hide();
  
  //       // Suppression des classes ajoutées par Bootstrap
  //       modalElement.classList.remove('show');
  //       modalElement.setAttribute('aria-hidden', 'true');
  //       document.body.classList.remove('modal-open');
  
  //       // Suppression sécurisée du backdrop
  //       const backdrop = document.querySelector('.modal-backdrop');
  //       if (backdrop) {
  //         backdrop.parentNode?.removeChild(backdrop);
  //       }
  //     } catch (error) {
  //       console.error('Erreur lors de la fermeture du modal :', error);
  //     }
  //   }
  // }
  

printTable(): void {
  const tableElement = document.getElementById('passagertable');
  if (!tableElement) {
    console.error('Table element not found!');
    return;
  }

  const printWindow = window.open('', '', 'width=900,height=650');
  if (!printWindow) {
    console.error('Failed to open print window.');
    return;
  }

  // Add content and styles to the new window
  printWindow.document.write(`
    <html>
      <head>
        <title>Matiere List</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
            color: #333;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <h1>Matiere List</h1>
        <p>Printed on ${new Date().toLocaleString()}</p>
        ${tableElement.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

  downloadAsExcel(): void {
  const tableElement = document.getElementById('passagertable') as HTMLTableElement;

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

  const blob = new Blob([excelData], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'PassagerList.xls';
  link.click();

  URL.revokeObjectURL(url);
}

}