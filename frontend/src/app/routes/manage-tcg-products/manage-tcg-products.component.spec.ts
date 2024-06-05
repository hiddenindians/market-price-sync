import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTcgProductsComponent } from './manage-tcg-products.component';

describe('ManageTcgProductsComponent', () => {
  let component: ManageTcgProductsComponent;
  let fixture: ComponentFixture<ManageTcgProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTcgProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageTcgProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
