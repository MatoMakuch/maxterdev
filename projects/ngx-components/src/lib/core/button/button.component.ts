import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'maxterdev-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'text' = 'primary';
  @Input() disabled: boolean = false;
  @Output() onClick = new EventEmitter<any>();

  protected getClass() {
    if (!this.disabled) return this.variant;
    else return 'disabled';
  }

  onButtonClick() {

    if (this.disabled) {
      return;
    }

    this.onClick.emit();
  }
}
