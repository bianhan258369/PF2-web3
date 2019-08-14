import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockdiagramDetailComponent } from './clockdiagram-detail.component';

describe('ClockdiagramDetailComponent', () => {
  let component: ClockdiagramDetailComponent;
  let fixture: ComponentFixture<ClockdiagramDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockdiagramDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockdiagramDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
