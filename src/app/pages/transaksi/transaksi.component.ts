import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators, FormBuilder } from '@angular/forms';
import { of, tap, mergeMap, combineLatest, finalize, timer } from 'rxjs';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-transaksi',
  templateUrl: './transaksi.component.html',
  styleUrls: ['./transaksi.component.scss']
})
export class TransaksiComponent implements OnInit {
  table:string = 'trx.json'
  form:FormGroup
  transactions: any = []
  products: any = []
  selectedProduct: any
  
  modalDisplay = {
    display: 'none'
  }
  backdropDisplay = {
    display: 'none',
    opacity: 0
  }

  loading = false
  constructor(
    private fb: FormBuilder,
    private service: HttpRequestService,
    private storageService: StorageService,
    ) {

    this.form = this.fb.group({
      code: new FormControl('', [Validators.required]),
      pelanggan: new FormControl('', Validators.required),
      qty: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      total: new FormControl(''),
      created_at: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.fetch()
  }

  /**
   * Generate new Code
   * 
   * @returns {string}
   */
  get generateCode(): string {
    const date = (new Date).getTime().toString()

    return date;
  }

  /**
   * Get Total of Trx
   */
  get total(): number {
    const qty: any = this.form.get('qty')?.value
    const price: any = this.form.get('price')?.value

    return (qty*price) > 0 ? (qty*price) : 0
  }

  /**
   * Created At
   * 
   */
  get created(): string {
    const date = new Date
    const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    const day = date.getDay() < 10 ? '0' + date.getDay() : date.getDay()

    return `${day}/${month}/${date.getFullYear()}`
  }

  /**
   * Patch Value form for Generate Code
   * 
   * @returns {void}
   */
  patch(): void {
    this.form.patchValue({
      code: this.generateCode,
      qty: 1
    })
  }

  /**
   * Fetch Trx
   * 
   * @returns {void}
   */
  fetch(): void {
    this.patch()

    of(true)
      .pipe(tap(() => this.loading = true))
      .pipe(mergeMap(() => combineLatest([
        this.service.get('barang.json'),
        this.service.get(this.table)
      ])))
      .pipe(finalize(() => timer(2000).subscribe(() => this.loading = false)))
      .subscribe({
        next: ([products, resolve]) => {
          this.products = products

          if(resolve) {
            console.log(resolve)
            this.transactions = resolve
            this.storageService.set(this.table, this.transactions)
          }
        }
      })
  }

  /**
   * Choosen product
   * 
   * @param product 
   * @returns {void}
   */
  choosen(product: any): void {
    this.selectedProduct = product
    this.form.patchValue({
      name: product.name,
      qty: 1,
      price: product.price
    })

    this.closeModal()
  }

  /**
   * Validate QTY i less than 1
   * 
   * @param ev 
   * @returns {void}
   */
  validateQTY(ev: any): void {
    if(ev.target.value < 1) {
        alert('QTY minimal adalah 1')
        this.form.patchValue({
          qty: 1
        })
    }
  }

  /**
   * Create new Trx
   * 
   * @returns {void}
   */
  submit(): void {
      const isValid = this.form.valid

      if(!isValid) {
        return this.validation()
      }

      const form = Object.assign(this.form.value, {total: this.total, created_at: this.created})
      this.transactions.push(form)
      this.storageService.set(this.table, this.transactions)
      this.updateStock()
      this.resetForm()
  }

  /**
   * Validation Form
   * 
   */
  validation(): void {
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
   * Delete Supplier
   * 
   * @param id 
   */
  destroy(id: number) {
    const confirmaton = confirm(`Yakin hapus data ini ?`)

    if(confirmaton) {
      const transactions = this.transactions.filter((s: any) => {
        return s.id !== id
      })

      this.storageService.set(this.table, transactions)
      this.fetch()
    }
  }

  /**
   * Update Stock Product
   * 
   * @returns {void}
   */
  updateStock(): void {
    const id: number = this.selectedProduct.id
    const qty: number = this.form.get('qty')?.value

    this.products.map((p: any) => {
      if(p.id == id) {
        p.stock = p.stock - qty
      }
    })

    this.storageService.set('barang.json', this.products)
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
  }

  /**
   * Reset Form
   * 
   */
  resetForm() {
    this.form.patchValue({
      code: this.generateCode,
      name: '',
      price: '',
      qty: 1,
      pelanggan: ''
    })
  }
}
