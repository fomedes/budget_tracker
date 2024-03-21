import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-icon-selection-dialog',
  templateUrl: './icon-selection-dialog.component.html',
  styleUrls: ['./icon-selection-dialog.component.scss'],
})
export class IconSelectionDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { icons: string[] },
    private dialogRef: MatDialogRef<IconSelectionDialogComponent>
  ) {}

  selectIcon(icon: string): void {
    this.dialogRef.close(icon);
  }
}
