import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuAdminComponent } from './Admin/menu-admin/menu-admin.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { EtablissementsComponent } from './Admin/etablissements/etablissements.component';
import { ProfesseursComponent } from './Admin/professeurs/professeurs.component';
import { MatieresComponent } from './Admin/matieres/matieres.component';
import { NiveauxComponent } from './Admin/niveaux/niveaux.component';
import { GroupesComponent } from './Admin/groupes/groupes.component';
import { CoursComponent } from './Admin/cours/cours.component';
import { PassagerComponent } from './Admin/passager/passager.component';
import { InscriptionComponent } from './Admin/inscription/inscription.component';
import { ListEtudiantComponent } from './Admin/list-etudiant/list-etudiant.component';
import { DetailEtudiantComponent } from './Admin/detail-etudiant/detail-etudiant.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/menu-admin/dashboard',  // Redirige vers le dashboard par défaut
    pathMatch: 'full',  // Vérifie si l'URL complète est vide
  },
  {
    path: 'menu-admin',  // Route pour le menu admin
    component: MenuAdminComponent,  // Le composant principal pour le menu
    children: [
      {
        path: 'dashboard',  // Route pour le dashboard
        component: DashboardComponent,  // Composant du dashboard
      },
       {
        path: 'inscriptions',  // Route pour le dashboard
        component: InscriptionComponent,  // Composant du dashboard
      },
         {
        path: 'passager',  // Route pour le dashboard
        component: PassagerComponent,  // Composant du dashboard
      },
       {
        path: 'cours',  // Route pour le dashboard
        component: CoursComponent,  // Composant du dashboard
      },
      {
        path: 'etablissements',  // Route pour les établissements
        component: EtablissementsComponent,  // Composant des établissements
      },
      {
        path: 'professeurs',  // Route pour les professeurs
        component: ProfesseursComponent,  // Composant des professeurs
      },
      {
        path: 'matiere',  // Route pour les matières
        component: MatieresComponent,  // Composant des matières
      },
      {
        path: 'niveaux',  // Route pour les niveaux
        component: NiveauxComponent,  // Composant des niveaux
      },
      {
        path: 'groupes',  // Route pour les groupes
        component: GroupesComponent,  // Composant des groupes
      },
         {
        path: 'etudiant',  // Route pour les groupes
        component: ListEtudiantComponent,  // Composant des groupes
      },
       {
        path: 'detail-etudiant/:idEtu',  // Route pour les groupes
        component: DetailEtudiantComponent,  // Composant des groupes
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
  
export class AppRoutingModule { }
