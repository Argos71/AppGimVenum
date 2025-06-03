import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriaEntrenamientosPage } from './categoria-entrenamientos.page';

describe('CategoriaEntrenamientosPage', () => {
  let component: CategoriaEntrenamientosPage;
  let fixture: ComponentFixture<CategoriaEntrenamientosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaEntrenamientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
