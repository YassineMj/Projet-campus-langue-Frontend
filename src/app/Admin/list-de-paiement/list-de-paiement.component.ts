import { Component } from '@angular/core';

@Component({
  selector: 'app-list-de-paiement',
  templateUrl: './list-de-paiement.component.html',
  styleUrls: ['./list-de-paiement.component.css']
})
export class ListDePaiementComponent {

  searchTerm: string = '';
  annee: string = '';
  mois: string = '';

  // Liste des années et des mois
  yearsList: string[] = Array.from({ length: 20 }, (_, i) => `${2024 + i}/${2025 + i}`);
  monthsList = [
    { value: '01', label: 'Janvier' },
    { value: '02', label: 'Février' },
    { value: '03', label: 'Mars' },
    { value: '04', label: 'Avril' },
    { value: '05', label: 'Mai' },
    { value: '06', label: 'Juin' },
    { value: '07', label: 'Juillet' },
    { value: '08', label: 'Août' },
    { value: '09', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' },
  ];

  // Méthodes
  filterInscriptions() {
    console.log('Search Term:', this.searchTerm);
    // Ajoutez ici votre logique pour filtrer les inscriptions
  }

  onDateChange() {
    console.log('Année:', this.annee, 'Mois:', this.mois);
    // Ajoutez ici votre logique pour gérer le changement de date
  }

  printTable() {
    console.log('Impression demandée.');
    // Ajoutez ici la logique pour imprimer la table
  }

  francaisColspan: number = 24; // Initial colspan for Français
  anglaisColspan: number = 24;  // Initial colspan for Anglais

  toggleColspan(language: string) {
    if (language === 'francais') {
      this.francaisColspan = 2; // Reduce Français size
      this.anglaisColspan = 0;  // Hide Anglais
    } else if (language === 'anglais') {
      this.anglaisColspan = 2; // Reduce Anglais size
      this.francaisColspan = 0; // Hide Français
    }
  }
// To control the visibility of other months for Français and Anglais
  showOtherMonthsFrancais: boolean = true;
  showOtherMonthsAnglais: boolean = true;

  // Method to toggle the visibility for Français
  toggleFrancaisVisibility() {
    this.showOtherMonthsFrancais = !this.showOtherMonthsFrancais;
  }

  // Method to toggle the visibility for Anglais
  toggleAnglaisVisibility() {
    this.showOtherMonthsAnglais = !this.showOtherMonthsAnglais;
  }


  getColspan(language: 'francais' | 'anglais'): number {
  let months = 1; // January
  if (language === 'francais' && this.showOtherMonthsFrancais) {
    months += 11; // Add the other months based on the condition
  } else if (language === 'anglais' && this.showOtherMonthsAnglais) {
    months += 11; // Add the other months based on the condition
  }
  return months * 2; // Each month has 2 columns (Tarif and Payé)
  }
  
}
