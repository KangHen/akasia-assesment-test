import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BarangComponent } from './pages/barang/barang.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { TransaksiComponent } from './pages/transaksi/transaksi.component';
import { authGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'barang', component: BarangComponent, canActivate: [authGuard] },
  { path: 'supplier', component: SupplierComponent, canActivate: [authGuard] },
  { path: 'trx', component: TransaksiComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
