import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuylistComponent } from './buylist.component';

describe('BuylistComponent', () => {
  let component: BuylistComponent;
  let fixture: ComponentFixture<BuylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuylistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
