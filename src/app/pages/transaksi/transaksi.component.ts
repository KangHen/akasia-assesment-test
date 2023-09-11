import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-transaksi',
  templateUrl: './transaksi.component.html',
  styleUrls: ['./transaksi.component.scss']
})
export class TransaksiComponent implements OnInit {

  form:FormGroup

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: new FormControl('', [Validators.required]),
      pelanggan: new FormControl('', Validators.required),
      qty: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
   

  }

  submit(): void {

  }
}
