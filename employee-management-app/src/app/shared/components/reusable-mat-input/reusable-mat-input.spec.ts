import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableMatInputComponent } from './reusable-mat-input';

describe('ReusableMatInput', () => {
  let component: ReusableMatInputComponent;
  let fixture: ComponentFixture<ReusableMatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableMatInputComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReusableMatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
