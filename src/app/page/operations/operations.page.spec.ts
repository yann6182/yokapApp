import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationsPage } from './operations.page';

describe('OperationsPage', () => {
  let component: OperationsPage;
  let fixture: ComponentFixture<OperationsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OperationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
