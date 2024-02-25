import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveriesComponent } from './deliveries.component';

describe('DeliveriesComponent', () => {
  let component: DeliveriesComponent;
  let fixture: ComponentFixture<DeliveriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveriesComponent]
    });
    fixture = TestBed.createComponent(DeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
