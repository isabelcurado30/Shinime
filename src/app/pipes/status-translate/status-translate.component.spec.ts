import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusTranslateComponent } from './status-translate.component';

describe('StatusTranslateComponent', () => {
  let component: StatusTranslateComponent;
  let fixture: ComponentFixture<StatusTranslateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusTranslateComponent]
    });
    fixture = TestBed.createComponent(StatusTranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
