import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddOperationPage } from './add-operation.page';

describe('AddOperationPage', () => {
  let component: AddOperationPage;
  let fixture: ComponentFixture<AddOperationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddOperationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
