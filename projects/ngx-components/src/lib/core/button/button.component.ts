import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostBinding,
} from '@angular/core';
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
  @Input() severity: 'primary' | 'secondary' | 'danger' | 'accent' = 'primary';
  @Input() text: boolean = false;
  @Input() disabled: boolean = false;
  @Input() textAlign: 'left' | 'center' | 'right' = 'center';
  @Output() onClick = new EventEmitter<any>();
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  @Input() chip: boolean = false;

  @HostBinding('class.xs') get hostXs() {
    return this.size === 'xs' || this.chip;
  }
  @HostBinding('class.sm') get hostSm() {
    return this.size === 'sm';
  }
  @HostBinding('class.lg') get hostLg() {
    return this.size === 'lg';
  }
  @HostBinding('attr.size') get sizeAttr() {
    return this.size;
  }

  protected getClass() {
    if (!this.disabled) {
      let cl = this.severity;
      const isChip = this.size === 'xs' || this.chip;
      if (this.text || isChip) cl += ' text';
      if (isChip) cl += ' chip';
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
