import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css']
})
export class MenuAdminComponent {

   activeLink: string = '';

  setActive(event: Event) {
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach(link => {
      link.classList.remove('focused'); // Remove the class from all links
    });

    // Add the 'focused' class to the clicked link
    const clickedLink = event.target as HTMLElement;
    clickedLink.classList.add('focused');
  }
  
}
