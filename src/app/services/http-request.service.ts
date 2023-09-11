import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService
  ) { }

  get(path: string): Observable<any> {
    const hasItem: any = this.storageService.has(path)

    if(hasItem) {
      const data: any = this.storageService.get(path)
      
      return of(data)
    }

    return this.httpClient.get(`/assets/${path}`)
            .pipe(
              catchError(this.errorHandler)
            )
  }

  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
