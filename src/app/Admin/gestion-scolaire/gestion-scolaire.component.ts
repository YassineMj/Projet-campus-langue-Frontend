import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-gestion-scolaire',
  templateUrl: './gestion-scolaire.component.html',
  styleUrls: ['./gestion-scolaire.component.css']
})
export class GestionScolaireComponent {

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
    const searchTerm = this.searchTerm.trim().toLowerCase(); // Nettoyer et convertir en minuscule
  
    this.filteredInscriptions = this.inscriptions.filter(e => {
      // Combiner nom et prénom dans les deux ordres
      const fullName = `${e.nom?.toLowerCase()} ${e.prenom?.toLowerCase()}`;
      const reverseFullName = `${e.prenom?.toLowerCase()} ${e.nom?.toLowerCase()}`;
  
      // Vérifier les autres champs
      const matchOtherFields =
        e.id.toString().includes(searchTerm);
  
      // Retourner true si une des conditions correspond
      return fullName.includes(searchTerm) || reverseFullName.includes(searchTerm) || matchOtherFields;
    });
  }
  

  id: any;
  
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

  formsData = {
     
    typeFrais: '',
     montant: null,

  };

   
  
inscription: any; // Define the variable with the appropriate type
openDetailsInscriptionModal(inscription: any): void {
    console.log(inscription); // Add your modal opening logic here
}

  formData = {
    typeFrais: '',
    montantt: null,
    description: '',
  };
    
printTable(): void {
  // Get the table element by its ID
  const tableElement = document.getElementById('list-etudiantTable');
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
        <title> List des etudiant </title>
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
          <h1>List des etudiant</h1>
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
    const tableElement = document.getElementById('list-etudiantTable') as HTMLTableElement;

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
