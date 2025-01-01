import { Component } from '@angular/core';
import {
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexAxisChartSeries,
  ChartType,
} from 'ng-apexcharts';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  
  constructor(private _service: GlobalService) {}

  ngOnInit(): void {
    this.getResume();
    this.getGroupes();
    this.getAnnulle();
    this.getInscriptionsParAnne();
    this.getPaiementsPonctuelsParAnnee();
    this.getPaiementsInscriptionsParAnnee();
    this.getChargesParAnnee();
    this.getNetParAnnee();
    this.loadProfs();
    this.getListEtud();
  }


resume: any;
loadingResume: boolean = false;
getResume() {
  this.loadingResume = true; // Début du chargement
  this._service.getResume().subscribe(
    data => {
      this.resume = data;
      this.loadingResume = false; // Fin du chargement
    },
    error => {
      console.error('Erreur lors de la récupération du résumé', error);
      this.loadingResume = false; // Fin du chargement en cas d'erreur
    }
  );
}

chartDataGroupesParMatiere: any;
loadingGroupes: boolean = false;
getGroupes() {
  this.loadingGroupes = true; // Début du chargement
  this._service.getGroupesParLangue().subscribe(
    data => {
      const labels = Object.keys(data); // Extraction des clés comme labels
      const series = Object.values(data); // Extraction des valeurs comme données

      // Configuration dynamique du graphique
      this.chartDataGroupesParMatiere = {
        series: series,
        chart: {
          type: 'donut',
          height: 350,
        },
        labels: labels,
        title: {
          text: 'Données Dynamiques (Donut Chart)',
        },
        legend: {
          position: 'bottom',
        },
        colors: Array.from({ length: labels.length }, () =>
          `#${Math.floor(Math.random() * 16777215).toString(16)}`
        ),
      };
      this.loadingGroupes = false; // Fin du chargement
    },
    error => {
      console.error('Erreur lors de la récupération des groupes', error);
      this.loadingGroupes = false; // Fin du chargement en cas d'erreur
    }
  );
}

chartDataAnnuelle: any;
chartDataAnnuelleDate = '2024/2025';
loadingAnnuelle: boolean = false;
getAnnulle() {
  this.loadingAnnuelle = true; // Début du chargement
  this._service.getAnnulle(this.chartDataAnnuelleDate).subscribe(
    data => {
      const labels = Object.keys(data); // Extraction des clés comme labels
      const series = Object.values(data); // Extraction des valeurs comme données

      // Configuration dynamique du graphique
      this.chartDataAnnuelle = {
        series: series,
        chart: {
          type: 'donut',
          height: 350,
        },
        labels: labels,
        title: {
          text: 'Données Dynamiques (Donut Chart)',
        },
        legend: {
          position: 'bottom',
        },
        colors: Array.from({ length: labels.length }, () =>
          `#${Math.floor(Math.random() * 16777215).toString(16)}`
        ),
      };
      this.loadingAnnuelle = false; // Fin du chargement
    },
    error => {
      console.error('Erreur lors de la récupération des données annuelles', error);
      this.loadingAnnuelle = false; // Fin du chargement en cas d'erreur
    }
  );
}

chartDataInscriptionsParAnnee: any;
loadingInscriptionsParAnnee: boolean = false;
getInscriptionsParAnne() {
  this.loadingInscriptionsParAnnee = true; // Début du chargement
  this._service.inscriptionsParAnne().subscribe(
    data => {
      const labels = Object.keys(data); // Années
      const series = Object.values(data); // Nombre d'inscriptions

      this.chartDataInscriptionsParAnnee = {
        series: [
          {
            name: 'Inscriptions',
            data: series,
          },
        ],
        chart: {
          type: 'bar', // Graphique en barres
          height: 350,
        },
        xaxis: {
          categories: labels, // Définit les années sur l'axe X
          title: {
            text: 'Années',
          },
        },
        colors: ['#219395'], // Couleur personnalisée pour les barres
      };
      this.loadingInscriptionsParAnnee = false; // Fin du chargement
    },
    error => {
      console.error('Erreur lors de la récupération des inscriptions par année', error);
      this.loadingInscriptionsParAnnee = false; // Fin du chargement en cas d'erreur
    }
  );
}

chartDataPaiementsPonctuelsParAnnee: any;

anneePaiementsPonctuels = '2024/2025';
loadingPaiementsPonctuels: boolean = false;
getPaiementsPonctuelsParAnnee() {
  this.loadingPaiementsPonctuels = true; // Début du chargement
  this._service.paiementsPonctuelsParAnnee(this.anneePaiementsPonctuels).subscribe(
    data => {
      const monthOrder = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

      const orderedData = monthOrder.map((month, index) => {
        const monthNumber = (index + 9) % 12 || 12;
        return data[monthNumber] || 0;
      });

      this.chartDataPaiementsPonctuelsParAnnee = {
        series: [
          {
            name: 'Revenus',
            data: orderedData,
          },
        ],
        chart: {
          type: 'line',
          height: 350,
        },
        xaxis: {
          categories: monthOrder,
          title: {
            text: 'Par mois',
          },
        },
        colors: ['#219395'],
      };
      this.loadingPaiementsPonctuels = false; // Fin du chargement
    },
    error => {
      console.error('Erreur lors de la récupération des paiements ponctuels', error);
      this.loadingPaiementsPonctuels = false; // Fin du chargement en cas d'erreur
    }
  );
}

chartDataPaiementsInscriptionsParAnnee: any;
anneePaiementsInscriptions = '2024/2025';
loadingPaiementsInscriptions: boolean = false;
getPaiementsInscriptionsParAnnee() {
  this.loadingPaiementsInscriptions = true; // Début du chargement
  this._service.paiementsInscriptionsParAnnee(this.anneePaiementsInscriptions).subscribe(
    data => {
      const monthOrder = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

      const orderedData = monthOrder.map((month, index) => {
        const monthNumber = (index + 9) % 12 || 12;
        return data[monthNumber] || 0;
      });

      this.chartDataPaiementsInscriptionsParAnnee = {
        series: [
          {
            name: 'Revenus',
            data: orderedData,
          },
        ],
        chart: {
          type: 'line',
          height: 350,
        },
        xaxis: {
          categories: monthOrder,
          title: {
            text: 'Par mois',
          },
        },
        colors: ['#219395'],
      };
      this.loadingPaiementsInscriptions = false; // Fin du chargement
    },
    error => {
      console.error('Erreur lors de la récupération des paiements des inscriptions', error);
      this.loadingPaiementsInscriptions = false; // Fin du chargement en cas d'erreur
    }
  );
}

chartDataChargesParAnnee: any;
anneeCharges: string = '2024/2025';
loadingCharges: boolean = false;
getChargesParAnnee() {
  this.loadingCharges = true; // Début du chargement
  this._service.chargesParAnnee(this.anneeCharges).subscribe(
    data => {
      const monthOrder = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

      const orderedData = monthOrder.map((month, index) => {
        const monthNumber = (index + 9) % 12 || 12;
        return data[monthNumber] || 0;
      });

      this.chartDataChargesParAnnee = {
        series: [
          {
            name: 'Charges',
            data: orderedData,
          },
        ],
        chart: {
          type: 'line',
          height: 350,
        },
        xaxis: {
          categories: monthOrder,
          title: {
            text: 'Par mois',
          },
        },
        colors: ['#FF5733'],
      };
      this.loadingCharges = false; // Fin du chargement
    },
    error => {
      console.error('Erreur lors de la récupération des charges par année', error);
      this.loadingCharges = false; // Fin du chargement en cas d'erreur
    }
  );
}

chartDataNetParAnnee: any;
anneeNet: string = '2024/2025';
loadingNet: boolean = false;
getNetParAnnee() {
  this.loadingNet = true; // Début du chargement
  this._service.netParAnnee(this.anneeNet).subscribe(
    data => {
      const monthOrder = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

      const orderedData = monthOrder.map((month, index) => {
        const monthNumber = (index + 9) % 12 || 12;
        return data[monthNumber] || 0;
      });

      this.chartDataNetParAnnee = {
        series: [
          {
            name: 'Chiffre d\'affaires',
            data: orderedData,
          },
        ],
        chart: {
          type: 'line',
          height: 350,
        },
        xaxis: {
          categories: monthOrder,
          title: {
            text: 'Par mois',
          },
        },
        colors: ['#28B463'],
      };
      this.loadingNet = false; // Fin du chargement
    },
    error => {
      console.error('Erreur lors de la récupération du chiffre d\'affaires', error);
      this.loadingNet = false; // Fin du chargement en cas d'erreur
    }
  );
}

profId: number | null = null;
profsList: any[] = [];
annee = '2024/2025';
mois = '1';
listEtu: any[] = [];
nbrEtud: any[] = [];
loadingProfs: boolean = false;
loadProfs(): void {
  this.loadingProfs = true; // Début du chargement
  this._service.getProfessors().subscribe(
    (data) => {
      this.profsList = data;
      this.loadingProfs = false; // Fin du chargement
    },
    (error) => {
      console.error('Erreur lors du chargement des profs', error);
      this.loadingProfs = false; // Fin du chargement en cas d'erreur
    }
  );
}
loadingEtu: boolean = false;

getListEtud() {
  this.loadingEtu=true
  this._service.getListEtud(this.annee, this.mois, this.profId).subscribe(
    data => {
      this.listEtu = data;
        this.loadingEtu=false

    },
    error => {
      console.error('Erreur lors de la récupération des étudiants', error);
      this.loadingEtu=false

    }
  );
  this.loadingEtu=true

  this._service.getNbrEtud(this.annee, this.mois, this.profId).subscribe(
    data => {
      this.nbrEtud = data;
            this.loadingEtu=false

    },
    error => {
      console.error('Erreur lors de la récupération du nombre d\'étudiants', error);
            this.loadingEtu=false

    }
  );
}


}
