import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'maxterdev-selectable-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selectable-button.component.html',
  styleUrls: [],
})
export class SelectableButtonComponent {
  @Input() selected: boolean = false;
  @Input() disabled: boolean = false;
  @Output() onClick = new EventEmitter<any>();
  @Input() textAlign: 'left' | 'center' | 'right' = 'center';

  protected getClass() {
    if (!this.disabled) {
      if (this.selected) return 'selected';
      else return 'unselected';
    }
    else return 'disabled';
  }

  onButtonClick() {

    if (this.disabled) {
      return;
    }

    this.onClick.emit();
  }
}
