import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriquesPage } from './historiques.page';

describe('HistoriquesPage', () => {
  let component: HistoriquesPage;
  let fixture: ComponentFixture<HistoriquesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HistoriquesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
