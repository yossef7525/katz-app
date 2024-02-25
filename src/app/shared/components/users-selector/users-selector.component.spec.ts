import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSelectorComponent } from './users-selector.component';

describe('UsersSelectorComponent', () => {
  let component: UsersSelectorComponent;
  let fixture: ComponentFixture<UsersSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersSelectorComponent]
    });
    fixture = TestBed.createComponent(UsersSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
