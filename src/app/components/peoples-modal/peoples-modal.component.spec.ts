import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeoplesModalComponent } from './peoples-modal.component';

describe('PeoplesModalComponent', () => {
  let component: PeoplesModalComponent;
  let fixture: ComponentFixture<PeoplesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeoplesModalComponent]
    });
    fixture = TestBed.createComponent(PeoplesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
