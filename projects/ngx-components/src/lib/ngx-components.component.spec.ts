import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxComponentsComponent } from './ngx-components.component';

describe('NgxComponentsComponent', () => {
  let component: NgxComponentsComponent;
  let fixture: ComponentFixture<NgxComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxComponentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
