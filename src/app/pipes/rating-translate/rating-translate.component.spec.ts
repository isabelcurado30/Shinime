import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingTranslateComponent } from './rating-translate.component';

describe('RatingTranslateComponent', () => {
  let component: RatingTranslateComponent;
  let fixture: ComponentFixture<RatingTranslateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RatingTranslateComponent]
    });
    fixture = TestBed.createComponent(RatingTranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
