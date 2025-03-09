import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'maxterdev-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
  @Input() checked: boolean = false;
  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() disabled: boolean = false;

  toggleChecked(): void {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.checkedChange.emit(this.checked);
    }
  }
}

