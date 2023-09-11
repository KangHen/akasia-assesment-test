import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { of, tap, mergeMap, finalize, timer, combineLatest } from 'rxjs';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-barang',
  templateUrl: './barang.component.html',
  styleUrls: ['./barang.component.scss']
})
export class BarangComponent implements OnInit {
  id: number = 0
  form: FormGroup
  products: any = []
  suppliers: any = []
  selectSupplier: any = []
  loading = false
  table: string = 'barang.json'

  modalDisplay = {
    display: 'none'
  }
  backdropDisplay = {
    display: 'none',
    opacity: 0
  }

  constructor(
    private service: HttpRequestService,
    private storageService: StorageService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      name: new FormControl('', [
        Validators.required
      ]),
      unit: new FormControl(''),
      stock: new FormControl('', [
        Validators.required
      ]),
      price: new FormControl('', [
        Validators.required
      ]),
      category: new FormControl(''),
      supplier: new FormControl(''),
    })
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
    const products = this.products
    products.sort((a: any, b: any) => {
      return a.id - b.id;
    });

    const last = products[products.length - 1]

    return last?.id ? last.id : 0
  }

  /**
   * Open Modal
   */
  openModal() {
    this.modalDisplay = {
      display: 'inline'
    }
    this.backdropDisplay = {
      display: 'inline',
      opacity: 0.5
    }
  }

  /**
   * Close Modal
   */
  closeModal() {
    this.modalDisplay = {
      display: 'none'
    }
    this.backdropDisplay = {
      display: 'none',
      opacity: 0
    }

    this.resetForm()
  }

  /**
   * Fetch products
   */
  fetch(): void {
    of(true)
      .pipe(tap(() => this.loading = true))
      .pipe(mergeMap(() => combineLatest([
        this.service.get('supplier.json'),
        this.service.get(this.table)
      ])))
      .pipe(finalize(() => timer(2000).subscribe(() => this.loading = false)))
      .subscribe({
        next: ([suppliers, resolve]) => {
          if(resolve) {
            const supplierItems = suppliers
            this.suppliers = suppliers

            supplierItems.map((i: any) => {
              this.selectSupplier[i.id] = i.name
            })

            this.products = resolve
            this.storageService.set(this.table, this.products)

            this.form.patchValue({
              supplier: 1,
              category: 'groceries',
              unit: 'pcs'
            })
          }
        }
      })
  }

  /**
   * Get Supplier Name
   * 
   * @param id 
   * 
   * @returns {string}
   */
  getSupplier(id: number): string {
    const supplier: string = this.selectSupplier[id]

    return supplier
  }

  /**
   * Create or Update Supplier
   */
  async save() {
    const isValid = this.form.valid

    if(!isValid) {
      return this.validation()
    }

    if(this.id > 0) {
      return this.update()
    }

    return this.store()
  }

  /**
   * Validation
   */
  async validation() {
    const controls = this.form.controls
    const fail: any = []
    Object.keys(controls).map((x: any, i: any) => {
      const finded = controls[x]

      if(finded.status == 'INVALID') {
          fail.push(x + ' kosong')
      }
    })

    const text = fail.join(',')

    alert(text)
  }

  /**
   * store function
   * 
   * Store Supplier to Database
   * @returns {void}
   */
  store(): void {
    const id = this.lastId + 1
    const form = Object.assign(this.form.value, { id: id })

    this.products.push(form)
    this.storageService.set(this.table, this.products)

    this.resetForm()
  }
  
  /**
   * Edit Supplier
   * 
   * @param id 
   * @returns {void}
   */
  edit(id: number) {
    const product = this.products.filter((s: any) => {
      return s.id == id
    })

    const [ find ] = product

    this.id = find.id

    this.form.patchValue({
      name: find.name,
      stock: find.stock,
      unit: find.unit,
      category: find.category,
      price: find.price,
      supplier: find.supplier
    })

    this.openModal()
  }

  /**
   * Update Field Supplier
   * 
   * @returns {void}
   */
  update(): void {
    const products = this.products.map((s: any) => {
        if(s.id == this.id) {
          const form = Object.assign(this.form.value, { id: this.id })
          s = form
        }

        return s
    })

    this.id = 0
    this.storageService.set(this.table, products)
    this.fetch()

    this.closeModal()
  }

  /**
   * Delete Supplier
   * 
   * @param id 
   */
  destroy(id: number) {
    const confirmaton = confirm(`Yakin hapus data ini ?`)

    if(confirmaton) {
      const products = this.products.filter((s: any) => {
        return s.id !== id
      })

      this.storageService.set(this.table, products)
      this.fetch()
    }
  }

  /**
   * Reset Form
   */
  resetForm() {
    this.form.patchValue({
      name: '',
      stock: '',
      unit: 'pcs',
      category: 'groceries',
      price: '',
      supplier: 1
    })
  }
}
