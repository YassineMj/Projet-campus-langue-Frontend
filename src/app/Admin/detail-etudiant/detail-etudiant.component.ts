import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { GlobalService } from '../global.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-etudiant',
  templateUrl: './detail-etudiant.component.html',
  styleUrls: ['./detail-etudiant.component.css']
})


export class DetailEtudiantComponent {

  @Input() idEtu!: any;

  isLoading: boolean = false;


  constructor(private activeRoute: ActivatedRoute,private _service: GlobalService) {
    this.activeRoute.params.subscribe((params) => {
      this.idEtu = params['idEtu'];
    });
  }

  etudiant:any
  inscriptions:any
  inscriptions2:any[]=[]

  filteredInscriptions:any[]=[]
  searchTerm: string = '';
  


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
    // this.loadCours();
    // this.loadProfs();
    // this.loadGroupes();
    this.loadDetails();
    
  }

  loadDetails(){
    this.isLoading = true;

    this._service.getEtudiantById(this.idEtu).subscribe(
      (data) => {
        this.etudiant=data
        
        this._service.getInscriptionsByIdEtudiant(this.idEtu).subscribe(
          (data) => {
            this.inscriptions=data
            this.inscriptions2=this.inscriptions.inscriptions;

            this.inscriptions2 = this.inscriptions2.map(i => ({
              ...i,
              mois: this.getMois(i.mois)
            }));

            this.filteredInscriptions=this.inscriptions2;

           },
          (error) => {
            alert('Erreur lors de chargement des inscriptions.');
          })
          this.isLoading = false;
       },
    
      (error) => {
        alert('Erreur lors de la mise à jour du Etudiant.');
        this.isLoading = false;
      }
    );
  }

  filterInscription(): void {
    this.filteredInscriptions = this.inscriptions2.filter(i => 
      i.annee.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      i.dateInscription.toString().includes(this.searchTerm.toLowerCase()) ||
      i.mois.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      i.prof.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      i.langue.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      i.groupe.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      i.cours.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
      
  }

  confirmDelete(idInsc:any): void {
    this.isLoading = true;

      this._service.deleteInscriptions(idInsc).subscribe(
        () => {
          this.loadDetails();
        },
        (error) => {
          this.isLoading = false;

          if(error.status==200){
            this.ngOnInit();
            return
          }
          alert('Erreur lors de la suppression d\'inscription.');

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
      test:null
    
  };

  onGroupChange(){
    this.groupes.forEach(element => {

      if(element.id==this.data.groupeId){
        this.data.emploidutemp=element.emploiDuTemps
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

  cours:any[]=[];
  profs:any[]=[];
  groupes:any[]=[];

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
