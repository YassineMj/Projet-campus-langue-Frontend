import { Component, Input, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { GlobalService } from '../global.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-paiement',
  templateUrl: './detail-paiement.component.html',
  styleUrls: ['./detail-paiement.component.css']
})
export class DetailPaiementComponent {

   @Input() idEtu!: any;

  isLoading: boolean = false;
  deleteMessage: string = ''; // This will hold the success message
  successMessage: string = ''; // This will hold the success message
  modifysuccess: string = '';
  hideSuccessMessage(): void {
    this.successMessage = ''; // Clear the message, hiding the alert
  }  selectedItemInscription: any={
    annee:"",
    cours:"",
    dateInscription:"",
    edt:"",
    groupe:"",
    id:null,
    langue:"",
    mois:"",
    prof:"",
    tarif:null
  };


  constructor(private activeRoute: ActivatedRoute,private _service: GlobalService) {
    this.activeRoute.params.subscribe((params) => {
      this.idEtu = params['idEtu'];
    });
  }

 


  etudiant:any

  inscriptions:any[]=[]
  filteredInscriptions:any[]=[]
  searchTermInscription: string = '';

  paiements:any[]=[]
  filteredPaiements:any[]=[]
  searchTermPaiement: string = '';
  


    getMois(mois: number): string {
    const moisNoms = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return moisNoms[mois - 1] || 'Inconnu';
  }

  formatEdt(edt: string): string {
    return edt.replace(/\n/g, ' | ');
  }

  ngOnInit(): void {

    this.loadDetails();
    
  }

  loadDetails(){
    this.isLoading = true;

    this._service.getEtudiantById(this.idEtu).subscribe(
      (data) => {
        this.etudiant=data
        
        this._service.getInscriptionsByIdEtudiant(this.idEtu).subscribe(
          (data:any) => {
            this.inscriptions=data.inscriptions
            this.inscriptions = this.inscriptions.map(i => ({
              ...i,
              mois: this.getMois(i.mois)
            }));
            this.filteredInscriptions=this.inscriptions;
           },
          (error) => {
            alert('Erreur lors de chargement des inscriptions.');
          })

          this._service.getPaiementsByIdEtudiant(this.idEtu).subscribe(
            (data:any) => {
              this.paiements=data 
              this.paiements = this.paiements.map(i => ({
                ...i,
                mois: this.getMois(i.mois)
              }));
              this.filteredPaiements=this.paiements;
             },
            (error) => {
              alert('Erreur lors de chargement des paiements.');
            })

          this.isLoading = false;
       },
    
      (error) => {
        alert('Erreur lors de chargement du Etudiant.');
        this.isLoading = false;
      }
    );
  }

  filterInscription(): void {
    this.filteredInscriptions = this.inscriptions.filter(i => 
      i.annee.toLowerCase().includes(this.searchTermInscription.toLowerCase()) ||
      i.dateInscription.toString().includes(this.searchTermInscription.toLowerCase()) ||
      i.mois.toLowerCase().includes(this.searchTermInscription.toLowerCase()) ||
      i.prof.toLowerCase().includes(this.searchTermInscription.toLowerCase()) ||
      i.langue.toLowerCase().includes(this.searchTermInscription.toLowerCase()) ||
      i.groupe.toLowerCase().includes(this.searchTermInscription.toLowerCase()) ||
      i.cours.toLowerCase().includes(this.searchTermInscription.toLowerCase())
    );
      
  }

  filterPaiements(): void {
    this.filteredPaiements = this.paiements.filter(i => 
      i.idInscription.toString().includes(this.searchTermPaiement.toLowerCase()) ||
      i.mois.toLowerCase().includes(this.searchTermPaiement.toLowerCase()) ||
      i.montant.toString().includes(this.searchTermPaiement.toLowerCase()) ||
      i.matiere.toLowerCase().includes(this.searchTermPaiement.toLowerCase()) ||
      i.datePaiement.toLowerCase().includes(this.searchTermPaiement.toLowerCase()) ||
      i.descriptionPaiement.toLowerCase().includes(this.searchTermPaiement.toLowerCase()) ||
      i.anne.toLowerCase().includes(this.searchTermPaiement.toLowerCase())
    );
      
  }

  openDetailsInscriptionModal(item: any): void {
    this.selectedItemInscription = item; 
    console.log(item);
    
    }


  // Déclaration des variables liées au formulaire
  description: string = '';
  montant: number | null = null;
  isLoadingPai=false;

  onSubmitPaiement(): void {
    // if (!this.selectedItemInscription?.id || !this.montant) {
    //   this.errorMessage = "Veuillez renseigner tous les champs obligatoires.";
    //   return;
    // }
  
    this.isLoadingPai = true;
    console.log(this.isLoadingPai);
    
    const dataPaiement = {
      inscriptionId: this.selectedItemInscription.id,
      montantPaye: this.montant,
      description: this.description || ""
    };
  
    this._service.addPaiement(dataPaiement).subscribe({
      next: (data) => {
          this.successMessage = 'Paiement ajouté avec succès'; // Set success message
          this.ngOnInit();
          this.isLoading = false;
          setTimeout(() => {
          this.successMessage = ''; // Hide the success message after 5 seconds
        }, 2000);
        // Réinitialisation des champs
        this.montant = null;
        this.description = "";
  
        // Affichage du message de succès
        this.successMessage = "Paiement enregistré avec succès.";
        this._service.getPaiementsByIdEtudiant(this.idEtu).subscribe(
          (data:any) => {
            this.paiements=data 
            this.paiements = this.paiements.map(i => ({
              ...i,
              mois: this.getMois(i.mois)
            }));
            this.filteredPaiements=this.paiements;
           },
          (error) => {
            alert('Erreur lors de chargement des paiements.');
          })
        this.isLoadingPai = false;

        setTimeout(() => {
          this.successMessage = ''; // Hide the success message after 5 seconds
        }, 3000);
      },
      error: (error) => {  
        // Affichage d'une erreur utilisateur claire
        //this.errorMessage = "Une erreur est survenue lors de l'enregistrement du paiement.";
        console.error("Erreur :", error);
        this.isLoadingPai = false;

      }
    });

  }
  
  deletePaiement(id:any){
    if (id) {
      this.isLoading = true;
      this._service.deletePaiement(id).subscribe(
        () => {
         this.deleteMessage = 'Paiement supprimé avec succès!';
          //alert('Cours supprimé avec succès!');
          this._service.getPaiementsByIdEtudiant(this.idEtu).subscribe(
            (data: any) => {
              this.paiements = data;
          
              // Test avant de transformer les paiements
              if (Array.isArray(this.paiements) && this.paiements.length > 0) {
                this.paiements = this.paiements.map(i => ({
                  ...i,
                  mois: this.getMois(i.mois) // Transformation uniquement si le test est validé
                }));
              } else {
                console.warn('Aucun paiement trouvé ou données invalides.');
              }
          
              this.filteredPaiements = this.paiements;
              console.log(this.filteredPaiements);
            },
            (error) => {
              alert('Erreur lors du chargement des paiements.');
            }
          );
          

          this.isLoading = false;

          setTimeout(() => {
          this.deleteMessage = ''; // Hide the success message after 5 seconds
        }, 2000);
            
        },
        (error) => {
          if(error.status==204){
            this.loadDetails();
            return
          }
          alert('Erreur lors de la suppression du paiement.');
          this.isLoading = false;
        }
      );
    }
  }

  idPaiement:any;
  openUpdateModal(item:any){
    this.idPaiement=item.idPaiement
    this.montant=item.montant
    this.description=item.descriptionPaiement
  }

  isLoadingUpdate = false
  
  onSubmitUpdate(){
    this.isLoadingUpdate=true
    const dataPaiement = {
      montantPaye: this.montant,
      description: this.description || ""
    };
    this._service.updatePaiement(dataPaiement,this.idPaiement).subscribe(
      (data)=>{
        this.montant=null
        this.description=''

        this._service.getPaiementsByIdEtudiant(this.idEtu).subscribe(
          (data: any) => {
       
            this.paiements=data 
            this.paiements = this.paiements.map(i => ({
              ...i,
              mois: this.getMois(i.mois)
            }));
            this.filteredPaiements = this.paiements;
                 this.modifysuccess = 'Montant modifier avec succès!';
          //alert('Cours mis à jour avec succès!');
          this.ngOnInit();
          this.isLoading = false;
          setTimeout(() => {
          this.modifysuccess = ''; // Hide the success message after 5 seconds
        }, 2000);
           },
          (error) => {
            alert('Erreur lors de chargement des paiements.');
          })

          this.isLoadingUpdate=false
      }
    )
  }
  
  
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
        <title>Detail D'etudiant</title>
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
          <h1>Detail D'etudiant</h1>
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
  const tableElement = document.getElementById('DetailDetudiant') as HTMLTableElement;

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
