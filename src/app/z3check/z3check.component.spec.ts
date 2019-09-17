import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Z3checkComponent } from './z3check.component';

describe('Z3checkComponent', () => {
  let component: Z3checkComponent;
  let fixture: ComponentFixture<Z3checkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Z3checkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Z3checkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
