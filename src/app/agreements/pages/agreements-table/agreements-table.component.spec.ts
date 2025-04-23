import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementsTableComponent } from './agreements-table.component';

describe('AgreementsTableComponent', () => {
  let component: AgreementsTableComponent;
  let fixture: ComponentFixture<AgreementsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgreementsTableComponent]
    });
    fixture = TestBed.createComponent(AgreementsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
