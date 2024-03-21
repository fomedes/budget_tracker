import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSelectionDialogComponent } from './icon-selection-dialog.component';

describe('IconSelectionDialogComponent', () => {
  let component: IconSelectionDialogComponent;
  let fixture: ComponentFixture<IconSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconSelectionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
