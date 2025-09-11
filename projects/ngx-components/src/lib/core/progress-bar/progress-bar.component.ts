import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'maxterdev-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: [] // Assuming you will import the SCSS globally or via angular.json
})
export class ProgressBarComponent {
  /**
   * The current value of the progress bar. Should be a number between 0 and 100.
   */
  @Input() value: number = 0;

  /**
   * Whether to display the percentage value text next to the bar.
   */
  @Input() showValue: boolean = true;

  /**
   * The unit to display next to the value.
   */
  @Input() unit: string = '%';

  /**
   * Ensures the value stays between 0 and 100 for styling purposes.
   * @returns The sanitized progress value.
   */
  get sanitizedValue(): number {
    return Math.max(0, Math.min(100, this.value));
  }
}