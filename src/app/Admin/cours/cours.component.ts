import { Component } from '@angular/core';

@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.css']
})
  
export class CoursComponent {
   // For adding a new subject
  nom: string = '';
  description: string = '';
  language: string = ''; // New attribute for language selection


 
  // Function to handle form submission for adding a new subject
  onSubmit(form: any) {
    if (form.valid) {
      console.log('New Subject Added:', {
        nom: this.nom,
        description: this.description,
        language: this.language
      });

      // Logic to save the new subject data (e.g., send data to a service)
    }
  }

    // Predefined list of languages
  languages: string[] = [
    'Français',
    'Anglais',
    'Espagnol',
    'Allemand',
    'Arabe',
    'Chinois'
  ];

  // Sample table data with unique id for each subject
  tableData = [
    { id: 1, nom: 'francais pour premiere annee', description: 'Lorem ipsum...', language: 'Français' },
    { id: 2, nom: 'mathematiques pour seconde', description: 'Lorem ipsum...', language: 'Anglais' },
  ];

  // Fields for editing
  editId: number | null = null;  // To store the ID for editing
  editNom: string = '';
  editDescription: string = '';
  editLanguage: string = '';

  // Pre-fill edit form when clicking "Edit"
  onEdit(item: any): void {
    this.editId = item.id;  // Store the ID of the subject being edited
    this.editNom = item.nom;
    this.editDescription = item.description;
    this.editLanguage = item.language;
  }

  // Function to handle form submission for editing a subject
  onEditSubmit(editForm: any) {
    if (editForm.valid && this.editId !== null) {
      const updatedItem = {
        id: this.editId,  // Ensure you're updating the correct ID
        nom: this.editNom,
        description: this.editDescription,
        language: this.editLanguage
      };

      // Update the subject in tableData
      const index = this.tableData.findIndex((item) => item.id === this.editId);
      if (index !== -1) {
        this.tableData[index] = updatedItem;
        console.log('Updated Subject:', updatedItem);
      }

      // Reset edit fields after submission
      this.clearEditFields();
    }
  }

  // Function to clear edit form fields
  clearEditFields(): void {
    this.editId = null;
    this.editNom = '';
    this.editDescription = '';
    this.editLanguage = '';
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

