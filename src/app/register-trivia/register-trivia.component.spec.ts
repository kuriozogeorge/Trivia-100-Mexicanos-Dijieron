import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTriviaComponent } from './register-trivia.component';

describe('RegisterTriviaComponent', () => {
  let component: RegisterTriviaComponent;
  let fixture: ComponentFixture<RegisterTriviaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterTriviaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterTriviaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
