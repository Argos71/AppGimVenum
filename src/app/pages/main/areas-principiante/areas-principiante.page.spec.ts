import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AreasPrincipiantePage } from './areas-principiante.page';

describe('AreasPrincipiantePage', () => {
  let component: AreasPrincipiantePage;
  let fixture: ComponentFixture<AreasPrincipiantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasPrincipiantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
