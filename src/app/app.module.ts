import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MenuAdminComponent } from './Admin/menu-admin/menu-admin.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { ProfesseursComponent } from './Admin/professeurs/professeurs.component';
import { GroupesComponent } from './Admin/groupes/groupes.component';
import { MatieresComponent } from './Admin/matieres/matieres.component';
import { NiveauxComponent } from './Admin/niveaux/niveaux.component';
import { EtablissementsComponent } from './Admin/etablissements/etablissements.component';
import { CoursComponent } from './Admin/cours/cours.component';

import { HttpClientModule } from '@angular/common/http';
import { PassagerComponent } from './Admin/passager/passager.component';
import { InscriptionComponent } from './Admin/inscription/inscription.component';
import { ListEtudiantComponent } from './Admin/list-etudiant/list-etudiant.component';
import { DetailEtudiantComponent } from './Admin/detail-etudiant/detail-etudiant.component';
import { DetailPaiementComponent } from './Admin/detail-paiement/detail-paiement.component';




@NgModule({
  declarations: [
    AppComponent,
    MenuAdminComponent,
    DashboardComponent,
    ProfesseursComponent,
    GroupesComponent,
    MatieresComponent,
    NiveauxComponent,
    EtablissementsComponent,
    CoursComponent,
    PassagerComponent,
    InscriptionComponent,
    ListEtudiantComponent,
    DetailEtudiantComponent,
    DetailPaiementComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
