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
  }

  deletesMessage = '';

  resume: any;
  loadingResume: boolean = false;
  getResume() {
    this.loadingResume = true; // Début du chargement
    this._service.getResume().subscribe(
      (data) => {
        this.resume = data;
        this.loadingResume = false; // Fin du chargement
      },
      (error) => {}
    );
  }

  chartDataGroupesParMatiere: any;
  loadingGroupes: boolean = false;

  getGroupes() {
    this.loadingGroupes = true; // Début du chargement
    this._service.getGroupesParLangue().subscribe(
      (data) => {
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
          colors: [
            '#ffbb00',
            '#ff5722',
            '#376e91',
            '#ff9800',
            '#4caf50',
            '#2196f3',
            '#9c27b0',
            '#673ab7',
            '#3f51b5',
            '#e91e63',
            '#f44336',
            '#8bc34a',
            '#cddc39',
            '#ffc107',
            '#00bcd4',
            '#009688',
            '#607d8b',
            '#795548',
            '#ffeb3b',
            '#b2ff59',
            '#ff80ab',
            '#ff7043',
            '#d500f9',
            '#76ff03',
            '#00e5ff',
            '#c51162',
            '#aa00ff',
            '#ff6f00',
            '#1de9b6',
            '#2962ff',
            '#00c853',
            '#ff1744',
            '#1a237e',
            '#00acc1',
            '#4dd0e1',
            '#ffab91',
            '#dce775',
            '#ffcc80',
            '#8e24aa',
            '#64b5f6',
            '#ffd600',
            '#6a1b9a',
            '#b71c1c',
            '#304ffe',
            '#dd2c00',
          ],

          legend: {
            position: 'bottom',
          },
        };

        this.loadingGroupes = false; // Fin du chargement
      },
      (error) => {}
    );
  }

  chartDataAnnuelle: any;
  chartDataAnnuelleDate = '2024/2025';
  loadingAnnuelle: boolean = false;

  getAnnulle() {
    this.loadingAnnuelle = true; // Début du chargement
    this._service.getAnnulle(this.chartDataAnnuelleDate).subscribe(
      (data) => {
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
          colors: [
            '#ffbb00',
            '#ff5722',
            '#4caf50',
            '#ff9800',
            '#2196f3',
            '#9c27b0',
            '#673ab7',
            '#3f51b5',
            '#e91e63',
            '#f44336',
            '#8bc34a',
            '#cddc39',
            '#ffc107',
            '#00bcd4',
            '#009688',
            '#607d8b',
            '#795548',
            '#ffeb3b',
            '#b2ff59',
            '#ff80ab',
            '#ff7043',
            '#d500f9',
            '#76ff03',
            '#00e5ff',
            '#c51162',
            '#aa00ff',
            '#ff6f00',
            '#1de9b6',
            '#2962ff',
            '#00c853',
            '#ff1744',
            '#1a237e',
            '#00acc1',
            '#4dd0e1',
            '#ffab91',
            '#dce775',
            '#ffcc80',
            '#8e24aa',
            '#64b5f6',
            '#ffd600',
            '#6a1b9a',
            '#b71c1c',
            '#304ffe',
            '#dd2c00',
          ],
          tooltip: {
            y: {
              formatter: function (val: number) {
                return val + ' DH'; // Ajoute "DH" après la valeur
              },
            },
          },
        };
        this.loadingAnnuelle = false; // Fin du chargement
      },
      (error) => {}
    );
  }

  chartDataInscriptionsParAnnee: any;
  loadingInscriptionsParAnnee: boolean = false;
  getInscriptionsParAnne() {
    this.loadingInscriptionsParAnnee = true; // Début du chargement
    this._service.inscriptionsParAnne().subscribe(
      (data) => {
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
          tooltip: {
            y: {
              formatter: function (val: number) {
                return val + ' DH'; // Affiche "Inscriptions" après la valeur
              },
            },
          },
        };
        this.loadingInscriptionsParAnnee = false; // Fin du chargement
      },
      (error) => {}
    );
  }

  chartDataPaiementsPonctuelsParAnnee: any;

  anneePaiementsPonctuels = '2024/2025';
  loadingPaiementsPonctuels: boolean = false;

  getPaiementsPonctuelsParAnnee() {
    this.loadingPaiementsPonctuels = true; // Début du chargement
    this._service
      .paiementsPonctuelsParAnnee(this.anneePaiementsPonctuels)
      .subscribe(
        (data) => {
          const monthOrder = [
            'Sept',
            'Oct',
            'Nov',
            'Déc',
            'Janv',
            'Févr',
            'Mars',
            'Avr',
            'Mai',
            'Juin',
            'Juil',
            'Août',
          ];

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
            tooltip: {
              y: {
                formatter: function (val: number) {
                  return val + ' DH'; // Append "DH" to the tooltip values
                },
              },
            },
          };
          this.loadingPaiementsPonctuels = false; // Fin du chargement
        },
        (error) => {}
      );
  }

  chartDataPaiementsInscriptionsParAnnee: any;
  anneePaiementsInscriptions = '2024/2025';
  loadingPaiementsInscriptions: boolean = false;
  getPaiementsInscriptionsParAnnee() {
    this.loadingPaiementsInscriptions = true; // Début du chargement
    this._service
      .paiementsInscriptionsParAnnee(this.anneePaiementsInscriptions)
      .subscribe(
        (data) => {
          const monthOrder = [
            'Sept',
            'Oct',
            'Nov',
            'Déc',
            'Janv',
            'Févr',
            'Mars',
            'Avr',
            'Mai',
            'Juin',
            'Juil',
            'Août',
          ];

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
        (error) => {}
      );
  }

  chartDataChargesParAnnee: any;
  anneeCharges: string = '2024/2025';
  loadingCharges: boolean = false;
  getChargesParAnnee() {
    this.loadingCharges = true; // Début du chargement
    this._service.chargesParAnnee(this.anneeCharges).subscribe(
      (data) => {
        const monthOrder = [
          'Sept',
          'Oct',
          'Nov',
          'Déc',
          'Janv',
          'Févr',
          'Mars',
          'Avr',
          'Mai',
          'Juin',
          'Juil',
          'Août',
        ];

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
          tooltip: {
            y: {
              formatter: function (val: number) {
                return val + ' DH'; // Append "DH" to tooltip values
              },
            },
          },
          colors: ['#FF5733'],
        };
        this.loadingCharges = false; // Fin du chargement
      },
      (error) => {}
    );
  }

  chartDataNetParAnnee: any;
  anneeNet: string = '2024/2025';
  loadingNet: boolean = false;

  getNetParAnnee() {
    this.loadingNet = true; // Début du chargement
    this._service.netParAnnee(this.anneeNet).subscribe(
      (data) => {
        const monthOrder = [
          'Sept',
          'Oct',
          'Nov',
          'Déc',
          'Janv',
          'Févr',
          'Mars',
          'Avr',
          'Mai',
          'Juin',
          'Juil',
          'Août',
        ];

        const orderedData = monthOrder.map((month, index) => {
          const monthNumber = (index + 9) % 12 || 12;
          return data[monthNumber] || 0;
        });

        this.chartDataNetParAnnee = {
          series: [
            {
              name: "Chiffre d'affaires",
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
          tooltip: {
            y: {
              formatter: function (val: number) {
                return val + ' DH'; // Append "DH" to tooltip values
              },
            },
          },
        };
        this.loadingNet = false; // Fin du chargement
      },
      (error) => {}
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
      (error) => {}
    );
  }
  loadingEtu: boolean = false;
  somme: number = 0.0;

  getListEtud() {
    this.loadingEtu = true;
    this._service.getListEtud(this.annee, this.mois, this.profId).subscribe(
      (data) => {
        this.listEtu = data;
        this.somme = 0;
        for (let etu of this.listEtu) {
          this.somme += etu.paye;
        }
        this.loadingEtu = false;
      },
      (error) => {}
    );

    this._service.getNbrEtud(this.annee, this.mois, this.profId).subscribe(
      (data) => {
        this.nbrEtud = data;
        this.loadingEtu = false;
      },
      (error) => {}
    );
  }

  print(): void {
    // Sélectionner la section à imprimer
    const printContent = document.getElementById('printSection');
    const windowPrint = window.open('', '', 'width=800,height=600');

    if (windowPrint && printContent) {
      // Ajouter le contenu au document de la fenêtre d'impression
      windowPrint.document.write(`
      <html>
        <head>
          <title>Etat Paiement Professeurs</title>
          <style>
            /* Général body styling */
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
          <h1>Etat Paiement Professeurs</h1>

          <p>Printed on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                    
        </div>
        <!-- Nom du Professeur -->
        <div style="margin-bottom: 20px; font-size: 18px; font-weight: bold; text-align: center; padding: 10px; background-color: #eaf4fc; border: 1px solid #0275d8; border-radius: 8px; color: #0275d8;">
        Professeur : Oumaima Hajji
        </div>

        <!-- Table des étudiants -->
        <div id="printSection">
          ${printContent.outerHTML}
        </div>

        <!-- Détails des étudiants -->
        <div class="total-etudiants mt-4">
          ${this.nbrEtud
            .map(
              (n) => `
            <div class="border p-3">
              <h4>${n.cours}: ${n.nombreEtudiants}</h4>
            </div>
          `
            )
            .join('')}
        </div>

        <!-- Total -->
        <div class="total-etudiants mt-4">
          <div class="border p-3">
            <h4>
              <span style="background-color: #ffbb00; padding: 5px; border-radius: 5px;">Total :</span>
              ${this.somme}
            </h4>
          </div>
        </div>

        </body>
      </html>
    `);

      // Fermer le flux d'écriture et lancer l'impression
      windowPrint.document.close();
      windowPrint.print();
    }
  }
}
