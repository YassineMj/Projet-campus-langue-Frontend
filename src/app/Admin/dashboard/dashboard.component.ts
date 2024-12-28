import { Component } from '@angular/core';
import { ApexChart, ApexXAxis, ApexTitleSubtitle, ApexAxisChartSeries, ChartType } from 'ng-apexcharts';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

chartData1 = {
  series: [
    {
      name: "Utilisateurs",
      data: [10, 20, 30, 40, 50]
    }
  ],
  chart: {
    type: "bar" as ChartType,
    height: 350
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May"]
  },
  title: {
    text: "Croissance des utilisateurs"
  },
  colors: ['#04b6b9']  // Custom colors
};

chartData2 = {
  series: [
    {
      name: "Revenus",
      data: [5000, 10000, 15000, 20000, 25000]
    }
  ],
  chart: {
    type: "line" as ChartType,
    height: 350
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May"]
  },
  title: {
    text: "Revenus mensuels"
  },
  colors: ['#FFA500']  // Custom color for the line chart
};


  // Pie Chart Data
  pieChartData = {
    series: [25, 35, 40],
    chart: {
      type: "pie" as ChartType,
      height: 350
    },
    labels: ["Complété", "En cours", "Non commencé"],
    title: {
      text: "Taux de Complétion des Tâches"
    },
    legend: {
      position: "top" as "top" | "right" | "bottom" | "left",  // Corrected the legend configuration
    },
      colors: ['#FFA500', '#219395', '#FFD700']  // Variants of orange for pie chart segments

  };

  // Donut Chart Data
  donutChartData = {
    series: [30, 40, 30],
    chart: {
      type: "donut" as ChartType,
      height: 350
    },
    labels: ["Complété", "En cours", "Non commencé"],
    title: {
      text: "Taux de Complétion des Tâches (Donut)"
    },
    legend: {
      position: "bottom" as "top" | "right" | "bottom" | "left",  // Corrected the legend configuration
    },
      colors: ['#FFA500', '#219395', '#FFD700']  // Variants of orange for pie chart segments

  };
  
  
}
