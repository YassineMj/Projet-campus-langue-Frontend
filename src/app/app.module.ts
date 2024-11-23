import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MenuAdminComponent } from './Admin/menu-admin/menu-admin.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { ProfesseursComponent } from './Admin/professeurs/professeurs.component';
import { GroupesComponent } from './Admin/groupes/groupes.component';
import { MatieresComponent } from './Admin/matieres/matieres.component';
import { NiveauxComponent } from './Admin/niveaux/niveaux.component';
import { EtablissementsComponent } from './Admin/etablissements/etablissements.component';
import { CoursComponent } from './Admin/cours/cours.component';



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
    CoursComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
     FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
