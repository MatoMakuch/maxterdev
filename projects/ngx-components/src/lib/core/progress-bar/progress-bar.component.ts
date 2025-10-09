import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

type ProgressVariant = 'default' | 'ultra-thin';

@Component({
  selector: 'maxterdev-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: [],
})
export class ProgressBarComponent {
  @Input() value: number = 0;

  @Input() showValue: boolean = true;

  @Input() showUnit: boolean = true;

  @Input() unit: string = '%';

  @Input() variant: ProgressVariant = 'default';

  @HostBinding('class.ultra-thin') get isUltraThin() {
    return this.variant === 'ultra-thin';
  }

  get sanitizedValue(): number {
    return Math.max(0, Math.min(100, this.value));
  }
}
