import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementsPageComponent } from './agreements-page.component';

describe('AgreementsPageComponent', () => {
  let component: AgreementsPageComponent;
  let fixture: ComponentFixture<AgreementsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgreementsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgreementsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
