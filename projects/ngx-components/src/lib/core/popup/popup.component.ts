import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'maxterdev-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrls: [],
})
export class PopupComponent {
  @Input() public isOpen = false;

  public open(): void {
    this.isOpen = true;
  }

  public close(): void {
    this.isOpen = false;
  }
}
