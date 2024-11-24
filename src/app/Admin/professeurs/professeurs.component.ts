import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-professeurs',
  templateUrl: './professeurs.component.html',
  styleUrls: ['./professeurs.component.css']
})
export class ProfesseursComponent implements OnInit{

  loadProfessors(): void {
    this._service.getProfessors().subscribe(
      (data) => {
        this.professors = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des professeurs', error);
      }
    );
  }

  professors: any[] = []; // Liste des professeurs

  constructor(private _service: GlobalService) {}

  ngOnInit(): void {
    this.loadProfessors();
  }

  nom = '';
  prenom = '';
  cin = '';
  tel = '';
  adresse = '';
  description = '';

  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form data:', {
        nom: this.nom,
        prenom: this.prenom,
        cin: this.cin,
        tel: this.tel,
        adresse: this.adresse,
        //description: this.description,
      });

      this._service.addProfessor({
        nom: this.nom,
        prenom: this.prenom,
        cin: this.cin,
        tel: this.tel,
        adresse: this.adresse,
        //description: this.description,
      }).subscribe(
        (response) => {
          console.log('Professeur ajouté avec succès:', response);
          alert('Professeur ajouté avec succès!');
          form.reset(); // Réinitialiser le formulaire
          this.ngOnInit()
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du professeur:', error);
          alert('Une erreur s\'est produite lors de l\'ajout.');
        }
      );
    } else {
      console.log('Form invalid');
    }
  }

  selectedProfessorId: number = 0;

openDeleteModal(professorId: number): void {
  this.selectedProfessorId = professorId;
  console.log(this.selectedProfessorId);
  
}

confirmDelete(): void {
  if (this.selectedProfessorId) {
    this._service.deleteProfessor(this.selectedProfessorId).subscribe(
      () => {
        console.log('Professeur supprimé avec succès');
        alert('Professeur supprimé avec succès');
        this.ngOnInit() // Actualiser la liste
      },
      (error) => {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression.');
      }
    );
  }
}

   // Pre-filled values
  id:any
  editNom = '';
  editPrenom = '';
  editCIN = '';
  editTelephone = '';
  editAdresse = '';
  editDescription = '';

  openEditModal(professeur: any) {
    this.id = professeur.id;
    this.editNom = professeur.nom;
    this.editPrenom = professeur.prenom;
    this.editCIN = professeur.cin;
    this.editTelephone = professeur.tel;
    this.editAdresse = professeur.adresse;
    this.editDescription = professeur.description;
  }

  onEditSubmit(form: any) {
    if (form.valid) {
      console.log('Updated values:', {
        nom: this.editNom,
        prenom: this.editPrenom,
        cin: this.editCIN,
        tel: this.editTelephone,
        adresse: this.editAdresse,
        //description: this.editDescription
      });

        if (this.id) {
          this._service
            .updateProfesseur(this.id, {
              nom: this.editNom,
              prenom: this.editPrenom,
              cin: this.editCIN,
              tel: this.editTelephone,
              adresse: this.editAdresse,
              //description: this.editDescription
            })
            .subscribe(
              (response) => {
                console.log('Professeur mis à jour avec succès :', response);
                alert('Professeur mis à jour avec succès');
                this.ngOnInit();
              },
              (error) => {
                console.error('Erreur lors de la mise à jour du professeur :', error);
                alert('Erreur lors de la mise à jour');
              }
            );
        }
      
    }
  }
  
printTable(): void {
  // Get the table element
  const tableElement = document.getElementById('professorsTable');
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
        <title>Professors List</title>
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
          <h1>Professors Information</h1>
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
downloadAsExcel(): void {
  const tableElement = document.getElementById('professorsTable') as HTMLTableElement;

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
  link.download = 'ProfessorsList.xls'; // Use .xls for compatibility
  link.click();

  // Clean up
  URL.revokeObjectURL(excelURL);
}


}
