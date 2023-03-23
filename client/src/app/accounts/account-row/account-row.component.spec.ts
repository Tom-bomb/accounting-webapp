import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRowComponent } from './account-row.component';

describe('AccountRowComponent', () => {
  let component: AccountRowComponent;
  let fixture: ComponentFixture<AccountRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
