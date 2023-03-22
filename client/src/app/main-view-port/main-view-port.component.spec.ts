import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainViewPortComponent } from './main-view-port.component';

describe('MainViewPortComponent', () => {
  let component: MainViewPortComponent;
  let fixture: ComponentFixture<MainViewPortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainViewPortComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainViewPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
