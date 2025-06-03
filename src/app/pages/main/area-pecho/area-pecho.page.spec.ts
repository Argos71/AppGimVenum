import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AreaPechoPage } from './area-pecho.page';

describe('AreaPechoPage', () => {
  let component: AreaPechoPage;
  let fixture: ComponentFixture<AreaPechoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaPechoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
