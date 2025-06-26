import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableMatInput } from './reusable-mat-input';

describe('ReusableMatInput', () => {
  let component: ReusableMatInput;
  let fixture: ComponentFixture<ReusableMatInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableMatInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableMatInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
