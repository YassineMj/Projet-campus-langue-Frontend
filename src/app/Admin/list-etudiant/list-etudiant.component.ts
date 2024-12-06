import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-list-etudiant',
  templateUrl: './list-etudiant.component.html',
  styleUrls: ['./list-etudiant.component.css']
})


export class ListEtudiantComponent {
  
  constructor(private _service: GlobalService) {}

  etudiants: any[] = [];
  etablissements: any[] = [];
  niveaux: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;

  inscriptions: any[] = [];
  filteredInscriptions: any[] = [];

  mois:any;
  annee:any;


  data2 = {
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
    passage: false
  };

  ngOnInit(): void {
    this.mois=new Date().getMonth()+1
    this.annee='2024/2025'
    console.log(this.mois);
    console.log(this.annee);

    this.loadEtudiants();
    this.loadEtablissements();
    this.loadNiveaux();
  }

  getFilteredGroupes(groupes:any) {
    const groupeMap = new Map();
  
    groupes.forEach((grp:any) => {
      if (groupeMap.has(grp.groupe)) {
        if (grp.active) {
          groupeMap.set(grp.groupe, { groupe: grp.groupe, active: true });
        }
      } else {
        groupeMap.set(grp.groupe, { groupe: grp.groupe, active: grp.active });
      }
    });
  
    return Array.from(groupeMap.values());
  }

  onDateChange(){
    this.loadEtudiants();
  }

  loadEtudiants(): void {
    this.isLoading = true;
    this._service.getInscriptions(this.mois,this.annee).subscribe(
      (data) => {
         
        this.etudiants = data;

        this.inscriptions = this.etudiants.map((etu) => ({
          id:etu.id,
          nom: etu.nom,
          prenom: etu.prenom,
          lesLangues:etu.lesLangues,
          groupes: this.getFilteredGroupes(etu.lesGroupes),
        }));
      
        console.log(this.inscriptions);
        this.filteredInscriptions=this.inscriptions

        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des etudiants', error);
        this.isLoading = false;
      }
    );
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

  filterInscriptions(): void {
    this.filteredInscriptions = this.inscriptions.filter(e => 
      e.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.id.toString().includes(this.searchTerm.toLowerCase())
      );
      
  }

  id:any;
  openEditModal(id: any): void {
    
    this.id = id;

    this._service.getEtudiantById(this.id).subscribe(
      (data) => {

        this.data2 = {
          nom: data.nom,
          prenom: data.prenom,
          etablissement: { id: data.etablissement.id },
          niveau: { id: data.niveau.id },
          telephone: data.telephone,
          commentaire: data.commentaire,
          nomMere: data.nomMere,
          telMere: data.telMere,
          nomPere: data.nomPere,
          telPere: data.telPere,
          passage: false
        };  
       },
      (error) => {
        alert('Erreur lors de la mise à jour du Etudiant.');
        this.isLoading = false;
      }
    );
  }


   modifysuccess: string = '';
   errorMessage: string = '';
  
  onSubmitMis(form: NgForm): void {
    if (form.valid) {
      this.isLoading = true;
      if (this.id) {
        if ('dateEnregistrement' in this.data2) {
          delete this.data2.dateEnregistrement;
        }        
        
        this._service.updateEtudiant(this.id, this.data2).subscribe(
          () => {
             this.modifysuccess = 'Etudiant modifier avec succès!';
            this.loadEtudiants();
            
            this.isLoading = false;
            setTimeout(() => {
            this.modifysuccess = ''; // Clear the message after 2 seconds
          }, 2000);  },
          (error) => {
            alert('Erreur lors de la mise à jour du Etudiant.');
            this.isLoading = false;
          }
        );
      }
    }
  }

  // Method to hide the success message when the close button is clicked
  hideSuccessMessage(): void {
    this.modifysuccess='';// Clear the message, hiding the alert
  }


    
  printTable(): void {
    const tableElement = document.getElementById('etudianttable');
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
          <h1>Etudiant List</h1>
          <p>Printed on ${new Date().toLocaleString()}</p>
          ${tableElement.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  }

    downloadAsExcel(): void {
    const tableElement = document.getElementById('etudianttable') as HTMLTableElement;

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
    link.download = 'etudianttable.xls';
    link.click();

    URL.revokeObjectURL(url);
  }

}
