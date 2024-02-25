import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveriesModalComponent } from './deliveries-modal.component';

describe('DeliveriesModalComponent', () => {
  let component: DeliveriesModalComponent;
  let fixture: ComponentFixture<DeliveriesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveriesModalComponent]
    });
    fixture = TestBed.createComponent(DeliveriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
