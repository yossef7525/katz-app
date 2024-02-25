import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrimSelectorComponent } from './matrim-selector.component';

describe('MatrimSelectorComponent', () => {
  let component: MatrimSelectorComponent;
  let fixture: ComponentFixture<MatrimSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatrimSelectorComponent]
    });
    fixture = TestBed.createComponent(MatrimSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
