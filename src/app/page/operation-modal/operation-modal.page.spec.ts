import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationModalPage } from './operation-modal.page';

describe('OperationModalPage', () => {
  let component: OperationModalPage;
  let fixture: ComponentFixture<OperationModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OperationModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
