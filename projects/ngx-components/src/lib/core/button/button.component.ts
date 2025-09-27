import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'maxterdev-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: [],
})
export class ButtonComponent {
  @Input() type: string = '';
  @Input() name: string = '';
  @Input() severity: 'primary' | 'secondary' = 'primary';
  @Input() text: boolean = false;
  @Input() disabled: boolean = false;
  @Input() textAlign: 'left' | 'center' | 'right' = 'center';
  @Output() onClick = new EventEmitter<any>();

  protected getClass() {
    if (!this.disabled) {
      var cl = this.severity;
      if (this.text) cl += ' text';
      return cl;
    } else return 'disabled';
  }

  onButtonClick() {
    if (this.disabled) {
      return;
    }

    this.onClick.emit();
  }
}
