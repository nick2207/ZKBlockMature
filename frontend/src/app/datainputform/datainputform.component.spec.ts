import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatainputformComponent } from './datainputform.component';

describe('DatainputformComponent', () => {
  let component: DatainputformComponent;
  let fixture: ComponentFixture<DatainputformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatainputformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatainputformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
