import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramDescriptionComponent } from './diagram-description.component';

describe('DiagramDescriptionComponent', () => {
  let component: DiagramDescriptionComponent;
  let fixture: ComponentFixture<DiagramDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
