import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetoAnualComponent } from './reto-anual.component';

describe('RetoAnualComponent', () => {
  let component: RetoAnualComponent;
  let fixture: ComponentFixture<RetoAnualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RetoAnualComponent]
    });
    fixture = TestBed.createComponent(RetoAnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
