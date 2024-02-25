import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributesModalComponent } from './distributes-modal.component';

describe('DistributesModalComponent', () => {
  let component: DistributesModalComponent;
  let fixture: ComponentFixture<DistributesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistributesModalComponent]
    });
    fixture = TestBed.createComponent(DistributesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
