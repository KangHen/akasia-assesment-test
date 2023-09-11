import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /**
   * Check Table from local storage
   * 
   * @param name 
   * @returns 
   */
  has(name: string) {
    const check = localStorage.getItem(name)
    
    return check ? true : false
  }

  /**
   * Get Table from local storage
   * @param name 
   */
  get(name: string) {
    const data: any = localStorage.getItem(name)

    return JSON.parse(data)
  }

  /**
   * Set data to Table
   * @param name 
   * @param data 
   * @returns 
   */
  set(name: string, data: any) {
    const  parsing = JSON.stringify(data)

    return localStorage.setItem(name, parsing)
  }
}
