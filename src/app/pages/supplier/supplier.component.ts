import { Component, OnInit } from '@angular/core';
import { 
  finalize,
  mergeMap,
  of,
  tap, 
  timer} from 'rxjs';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {
  name: string = ''
  id: number = 0

  suppliers: any = []
  loading = false
  table: string = 'supplier.json'

  constructor(
    private service: HttpRequestService,
    private storageService: StorageService
  ) {
   
  }

  ngOnInit(): void {
    this.fetch()
  }

  /**
   * lastId
   * 
   * @returns {number}
   */
  get lastId(): number {
    const suppliers = this.suppliers
    suppliers.sort((a: any, b: any) => {
      return a.id - b.id;
    });

    const last = suppliers[suppliers.length - 1]

    return last?.id ? last.id : 0
  }

  /**
   * Fetch Suppliers
   */
  fetch(): void {
    of(true)
      .pipe(tap(() => this.loading = true))
      .pipe(mergeMap(() => this.service.get('supplier.json')))
      .pipe(finalize(() => timer(2000).subscribe(() => this.loading = false)))
      .subscribe({
        next: (resolve) => {
          if(resolve) {
            this.suppliers = resolve
            this.storageService.set(this.table, this.suppliers)
          }
        }
      })
  }

  /**
   * Create or Update Supplier
   */
  save(): void {
    if(this.id > 0) {
      return this.update()
    }

    return this.store()
  }

  /**
   * store function
   * 
   * Store Supplier to Database
   * @returns {void}
   */
  store(): void {
    const id = this.lastId + 1
    const data: any = {
      id: id,
      name: this.name
    }

    this.name = ''
    
    this.suppliers.push(data)
    this.storageService.set(this.table, this.suppliers)
  }
  
  /**
   * Edit Supplier
   * 
   * @param id 
   * @returns {void}
   */
  edit(id: number) {
    const supplier = this.suppliers.filter((s: any) => {
      return s.id == id
    })

    const [ find ] = supplier

    this.name = find.name
    this.id = find.id
  }

  /**
   * Update Field Supplier
   * 
   * @returns {void}
   */
  update(): void {
    const suppliers = this.suppliers.map((s: any) => {
        if(s.id == this.id) {
          s.name = this.name
        }

        return s
    })

    this.id = 0
    this.name = ''
    this.storageService.set(this.table, suppliers)
  }

  /**
   * Delete Supplier
   * 
   * @param id 
   */
  destroy(id: number) {
    const confirmaton = confirm(`Yakin hapus data ini ?`)

    if(confirmaton) {
      const suppliers = this.suppliers.filter((s: any) => {
        return s.id !== id
      })

      this.storageService.set(this.table, suppliers)
      this.fetch()
    }
  }
}
