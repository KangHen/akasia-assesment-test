import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaksiComponent } from './transaksi.component';

describe('TransaksiComponent', () => {
  let component: TransaksiComponent;
  let fixture: ComponentFixture<TransaksiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransaksiComponent]
    });
    fixture = TestBed.createComponent(TransaksiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
