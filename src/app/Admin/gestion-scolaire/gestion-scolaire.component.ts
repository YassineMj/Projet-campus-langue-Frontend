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
  
 

   formsData = {
    typeFrais: '',
    montant: null,
    description: '',
    annee:'',
  };

  
  // Define the editData object with default values
  editData = {
    annee: '',
    typeFrais: '',
    montant: null,
    description: ''
  };

  // Add the onSubmitEdit method
  onSubmitEdit(form: any) {
    if (form.valid) {
      console.log('Form Data:', this.editData);
      // Implement your logic here
    }
  }

  openEditModal(itemId: number) {
  console.log("Edit modal opened for item ID:", itemId);
  // Add your logic here
}

  
 
}
