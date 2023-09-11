import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestService } from '../services/http-request.service';
import { Auth } from './login.interface';
import { of, tap, mergeMap, finalize, timer } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  cresidential?: Auth
  username!: string
  password!: string

  table:string = 'user.json'
  loading = false

  constructor(
    private router: Router,
    private service: HttpRequestService,
    private storageService: StorageService
  ){

  }

  /**
   * Auth
   * 
   * Check Auth for Login
   * @returns {void}
   */
  auth(): void {
    if(!this.username || !this.password) {
      return alert('Username atau Password tidak boleh Kosong')
    }

    of(true)
      .pipe(tap(() => this.loading = true))
      .pipe(mergeMap(() => this.service.get(this.table)))
      .pipe(finalize(() => timer(2000).subscribe(() => this.loading = false)))
      .subscribe({
        next: (resolve) => {
          this.cresidential = resolve.user

          if(this.username === this.cresidential?.username && this.password === this.cresidential.password) {
            this.storageService.set('auth', this.cresidential)
            this.router.navigate(['barang'])
          }else{
            alert('Username atau Password salah!')
          }
        }
      })
  }
}
