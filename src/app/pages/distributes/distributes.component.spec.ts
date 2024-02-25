import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributesComponent } from './distributes.component';

describe('DistributesComponent', () => {
  let component: DistributesComponent;
  let fixture: ComponentFixture<DistributesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DistributesComponent]
    });
    fixture = TestBed.createComponent(DistributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
