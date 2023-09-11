import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/login/login.interface';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  @Input() loading = false
  
  user!: Auth
  constructor(
    private storageService: StorageService,
    private router: Router
  ){
    this.user = this.storageService.get('auth')
  }
  
  /**
   * Logout User
   * 
   * @returns {void}
   */
  logout(): void {
    const confirmation = confirm('Yakin Logout ?')

    if(confirmation) {
      this.storageService.remove('auth')

      this.router.navigate(['/'])
    }
  }
}
