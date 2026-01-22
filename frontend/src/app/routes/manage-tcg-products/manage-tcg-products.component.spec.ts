import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTCGProductsComponent } from './manage-tcg-products.component';

describe('ManageTcgProductsComponent', () => {
  let component: ManageTCGProductsComponent;
  let fixture: ComponentFixture<ManageTCGProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
  imports: [ManageTCGProductsComponent]
    })
    .compileComponents();
    
  fixture = TestBed.createComponent(ManageTCGProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
