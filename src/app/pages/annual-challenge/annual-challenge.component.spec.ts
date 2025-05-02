import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualChallengeComponent } from './annual-challenge.component';

describe('AnnualChallengueComponent', () => {
  let component: AnnualChallengeComponent;
  let fixture: ComponentFixture<AnnualChallengeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnualChallengeComponent]
    });
    fixture = TestBed.createComponent(AnnualChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
