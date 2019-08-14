import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddconstraintComponent } from './addconstraint.component';

describe('AddconstraintComponent', () => {
  let component: AddconstraintComponent;
  let fixture: ComponentFixture<AddconstraintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddconstraintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddconstraintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
