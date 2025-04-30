import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenresTranslateComponent } from './genres-translate.component';

describe('GenresTranslateComponent', () => {
  let component: GenresTranslateComponent;
  let fixture: ComponentFixture<GenresTranslateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenresTranslateComponent]
    });
    fixture = TestBed.createComponent(GenresTranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
