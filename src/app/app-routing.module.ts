import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BarangComponent } from './pages/barang/barang.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { TransaksiComponent } from './pages/transaksi/transaksi.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'barang', component: BarangComponent },
  { path: 'supplier', component: SupplierComponent },
  { path: 'trx', component: TransaksiComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
