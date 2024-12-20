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
  

}
