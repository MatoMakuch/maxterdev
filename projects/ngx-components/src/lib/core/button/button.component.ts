import { Component, Input } from '@angular/core';

@Component({
  selector: 'maxterdev-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() disabled: boolean = false;
  @Input() data: any;  // Accept data input

  onButtonClick() {
    console.log('Button clicked! Data:', this.data);
  }
}
