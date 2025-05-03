import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

import { CommonModule } from '@angular/common';
import { AutosizeDirective } from '../../app/directives/autosize.directive';

@Component({
  selector: 'maxterdev-input',
  standalone: true,
  imports: [CommonModule, AutosizeDirective],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() placeholder: string = 'Select an option';
  @Input() multiline: boolean = false;

  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<any[]>();
}
