import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitaListComponent } from './visit-list.component';

describe('VisitListComponent', () => {
  let component: VisitaListComponent;
  let fixture: ComponentFixture<VisitaListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitaListComponent]
    });
    fixture = TestBed.createComponent(VisitaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
