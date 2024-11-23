import { Component } from '@angular/core';

@Component({
  selector: 'app-niveaux',
  templateUrl: './niveaux.component.html',
  styleUrls: ['./niveaux.component.css']
})
export class NiveauxComponent {
  // For adding a new subject
  
  // Sample table data with unique id for each subject
  tableData = [
    { id: 1, nom: 'niv1' },
    { id: 2, nom: 'niv2' },
    { id: 3, nom: 'niv3' }
  ];

  // For adding a new subject
  nom: string = '';

  // For editing a subject (pre-filled values)
  editNom: string = '';
  editId: number | null = null;  // Store ID for the subject being edited

  // Function to handle form submission for editing a subject
  onEditSubmit(editForm: any) {
    if (editForm.valid && this.editId !== null) {
      const updatedSubject = {
        id: this.editId,  // Ensure you're updating the correct subject ID
        nom: this.editNom,
      };

      // Find the subject in tableData and update it
      const index = this.tableData.findIndex(subject => subject.id === this.editId);
      if (index !== -1) {
        this.tableData[index] = updatedSubject;  // Replace the old subject with the updated one
        console.log('Updated subject:', updatedSubject);
      }

      // Reset edit fields after submitting
      this.clearEditFields();
    }
  }

  // Function to pre-fill the edit form when clicking the Edit button
  onEdit(subject: any) {
    this.editId = subject.id;  // Set the ID of the subject being edited
    this.editNom = subject.nom;  // Pre-fill the subject name
  }

  // Function to handle form submission for adding a new subject
  onSubmit(form: any) {
    if (form.valid) {
      const newSubject = {
        id: this.tableData.length + 1,  // Generate a new ID based on tableData length (can be improved)
        nom: this.nom,
      };
      
      // Add new subject to the tableData
      this.tableData.push(newSubject);
      console.log('New subject added:', newSubject);

      // Reset form fields after submission
      this.nom = '';
    }
  }

  // Function to reset the form fields after editing
  clearEditFields() {
    this.editId = null;
    this.editNom = '';
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
