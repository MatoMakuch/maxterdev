import { Component, Input } from '@angular/core';

@Component({
  selector: 'cyberfab-button',
  standalone: true,
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  @Input() data: any;  // Accept data input

  onButtonClick() {
    console.log('Button clicked! Data:', this.data);
  }
}
